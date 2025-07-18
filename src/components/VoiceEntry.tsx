import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { safeStart, safeStop, safeDestroy, safeRemoveAllListeners } from '../utils/voiceSafeWrapper';
import { isFeatureEnabled } from '../config/featureFlags';

interface VoiceEntryProps {
    onVoiceResult: (text: string) => void;
}

const VoiceEntry: React.FC<VoiceEntryProps> = ({ onVoiceResult }) => {
    const [isListening, setIsListening] = useState<boolean>(false);
    const [results, setResults] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize voice recognition
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechEnd = onSpeechEnd;

        return () => {
            // Cleanup using safe wrappers
            safeDestroy().then(() => {
                safeRemoveAllListeners();
            });
        };
    }, []);

    const onSpeechResults = (e: SpeechResultsEvent) => {
        if (e.value && e.value.length > 0) {
            setResults(e.value);
            onVoiceResult(e.value[0]); // Pass the first (most likely) result to the parent
        }
    };

    const onSpeechError = (e: any) => {
        setError(e.error?.message || 'Unknown error');
        setIsListening(false);
    };

    const onSpeechEnd = () => {
        setIsListening(false);
    };

    const toggleListening = async () => {
        try {
            if (isListening) {
                await safeStop();
                setIsListening(false);
            } else {
                setError(null);
                setResults([]);
                await safeStart('en-US');
                setIsListening(true);
            }
        } catch (e) {
            console.error(e);
            setError('Failed to start voice recognition');
        }
    };

    // If voice entry feature is disabled, don't render anything
    if (!isFeatureEnabled('voiceEntry')) {
        return null;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, isListening ? styles.listening : null]}
                onPress={toggleListening}
            >
                {isListening ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Text style={{ fontSize: 24, color: '#fff' }}>🎤</Text>
                )}
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}
            {results.length > 0 && !isListening && (
                <Text style={styles.resultText}>
                    {results[0]}
                </Text>
            )}
            {isListening && (
                <Text style={styles.listeningText}>Listening...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    listening: {
        backgroundColor: '#F44336',
    },
    micIcon: {
        fontSize: 24,
        color: '#fff',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    resultText: {
        marginTop: 10,
        fontStyle: 'italic',
    },
    listeningText: {
        marginTop: 10,
        color: '#F44336',
        fontWeight: 'bold',
    },
});

export default VoiceEntry;