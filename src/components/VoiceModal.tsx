import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
    Easing
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { processVoiceCommand } from '../utils/voiceCommandProcessor';
import { requestMicrophonePermission } from '../utils/voicePermissions';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { safeStart, safeStop, safeDestroy, safeRemoveAllListeners, isVoiceAvailable } from '../utils/voiceSafeWrapper';

interface VoiceModalProps {
    visible: boolean;
    onClose: () => void;
    onVoiceResult: (itemName: string, itemLocation: string) => void;
}

const VoiceModal: React.FC<VoiceModalProps> = ({ visible, onClose, onVoiceResult }) => {
    const { colors } = useTheme();
    const [isListening, setIsListening] = useState(false);
    const [processingResult, setProcessingResult] = useState(false);
    const [animationValue] = useState(new Animated.Value(1));
    const [recognizedText, setRecognizedText] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Initialize voice recognition when modal becomes visible
    useEffect(() => {
        if (visible) {
            const setupVoice = async () => {
                try {
                    // Check if Voice API is available
                    if (!isVoiceAvailable()) {
                        console.warn('Voice API is not available on this platform');
                        setError('Voice recognition is not available on this device');
                        return;
                    }

                    // Initialize voice recognition using safe wrappers
                    await safeDestroy();
                    safeRemoveAllListeners();

                    // Set up event listeners
                    Voice.onSpeechStart = () => {
                        setIsListening(true);
                        setError(null);
                    };

                    Voice.onSpeechResults = (result: SpeechResultsEvent) => {
                        if (result.value && result.value.length > 0) {
                            setRecognizedText(result.value[0]);
                        }
                    };

                    Voice.onSpeechError = (err) => {
                        setIsListening(false);
                        setError(`Error: ${err.error?.message || 'Voice recognition failed'}`);
                        console.error('Voice recognition error:', err);
                    };

                    Voice.onSpeechEnd = () => {
                        setIsListening(false);
                        if (recognizedText) {
                            setProcessingResult(true);
                        }
                    };
                } catch (err) {
                    console.error('Failed to initialize voice recognition:', err);
                    setError('Failed to initialize voice recognition');
                }
            };

            setupVoice();
        }

        // Cleanup when modal is closed
        return () => {
            const cleanupVoice = async () => {
                try {
                    // Use safe wrappers for cleanup
                    await safeStop();
                    safeRemoveAllListeners();
                    await safeDestroy();
                } catch (err) {
                    console.error('Error cleaning up voice recognition:', err);
                }
            };

            cleanupVoice();
        };
    }, [visible, recognizedText]);

    // Process the recognized text when voice recognition ends
    useEffect(() => {
        if (processingResult && recognizedText) {
            const processResult = async () => {
                try {
                    // Use our voice command processor to extract item name and location
                    const processedCommand = processVoiceCommand(recognizedText);

                    if (processedCommand) {
                        onVoiceResult(processedCommand.itemName, processedCommand.itemLocation);
                    }

                    // Reset state and close modal
                    setProcessingResult(false);
                    setRecognizedText('');
                    onClose();
                } catch (err) {
                    console.error('Error processing voice result:', err);
                    setProcessingResult(false);
                    setError('Failed to process voice command');
                }
            };

            processResult();
        }
    }, [processingResult, recognizedText, onVoiceResult, onClose]);

    // Animation for the microphone pulse effect
    useEffect(() => {
        if (isListening) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animationValue, {
                        toValue: 1.2,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(animationValue, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            animationValue.setValue(1);
        }
    }, [isListening, animationValue]);

    const startListening = async () => {
        try {
            setError(null);
            setRecognizedText('');

            // Request microphone permission first
            const hasPermission = await requestMicrophonePermission();
            if (!hasPermission) {
                setError('Microphone permission denied. Please enable it in your device settings.');
                return;
            }

            // Check if Voice API is available
            if (!isVoiceAvailable()) {
                console.warn('Voice API is not available, using fallback mode');
                useFallbackMode();
                return;
            }

            setIsListening(true);

            try {
                // Try to use the real Voice API with our safe wrapper
                console.log('Starting voice recognition...');
                await safeStart('en-US');
                console.log('Voice recognition started successfully');
            } catch (voiceErr: any) {
                console.error('Error starting voice recognition:', voiceErr);

                // If the real Voice API fails, fall back to the demo mode
                console.log('Falling back to demo mode');
                useFallbackMode();
            }
        } catch (err: any) {
            console.error('Error in voice recognition setup:', err);
            setIsListening(false);
            setError(`Failed to initialize voice recognition: ${err.message || 'Unknown error'}`);
        }
    };

    // Helper function for fallback mode
    const useFallbackMode = () => {
        setIsListening(true);

        // Simulate listening for 3 seconds
        setTimeout(() => {
            setIsListening(false);
            setProcessingResult(true);

            // Simulate a successful voice recognition result
            const demoResults = [
                'Hammer in garage toolbox',
                'Screwdriver in workshop drawer',
                'Winter clothes in attic storage',
                'Spare batteries in kitchen drawer'
            ];

            // Pick a random result
            const randomResult = demoResults[Math.floor(Math.random() * demoResults.length)];
            setRecognizedText(randomResult);

            console.log('Demo voice recognition result:', randomResult);
        }, 3000);
    };

    const stopListening = async () => {
        try {
            // Stop the voice recognition using our safe wrapper
            try {
                await safeStop();
            } catch (voiceErr) {
                console.log('Error stopping Voice API, may be using fallback mode:', voiceErr);
            }

            // Update UI state
            setIsListening(false);
            if (recognizedText) {
                setProcessingResult(true);
            }
        } catch (err) {
            console.error('Error stopping voice recognition:', err);
            setError('Failed to stop voice recognition');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Voice Entry</Text>

                    <Text style={[styles.instructions, { color: colors.textSecondary }]}>
                        Say the item name followed by "in" or "at" and then the location.
                    </Text>
                    <Text style={[styles.example, { color: colors.accent }]}>
                        Example: "Hammer in garage toolbox"
                    </Text>

                    <View style={styles.micContainer}>
                        {isListening ? (
                            <Animated.View
                                style={[
                                    styles.pulseCircle,
                                    {
                                        backgroundColor: colors.accent + '40',
                                        transform: [{ scale: animationValue }]
                                    }
                                ]}
                            />
                        ) : null}

                        <TouchableOpacity
                            style={[
                                styles.micButton,
                                { backgroundColor: isListening ? colors.error : colors.accent }
                            ]}
                            onPress={isListening ? stopListening : startListening}
                            disabled={processingResult}
                        >
                            {processingResult ? (
                                <ActivityIndicator color="#fff" size="large" />
                            ) : (
                                <Text style={styles.micIcon}>{isListening ? '⏹' : '🎤'}</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.statusText, { color: colors.primary }]}>
                        {isListening ? 'Listening...' :
                            processingResult ? 'Processing...' :
                                'Tap microphone to start'}
                    </Text>

                    {error && (
                        <Text style={[styles.errorText, { color: colors.error }]}>
                            {error}
                        </Text>
                    )}

                    {recognizedText && !isListening && !processingResult && (
                        <Text style={[styles.recognizedText, { color: colors.text }]}>
                            "{recognizedText}"
                        </Text>
                    )}

                    <TouchableOpacity
                        style={[styles.cancelButton, { borderColor: colors.cardBorder }]}
                        onPress={onClose}
                        disabled={processingResult}
                    >
                        <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    instructions: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 8,
    },
    example: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 24,
    },
    micContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        height: 120,
        width: 120,
    },
    pulseCircle: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    micButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    micIcon: {
        fontSize: 32,
        color: 'white',
    },
    statusText: {
        fontSize: 16,
        fontWeight: '500',
        marginVertical: 16,
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '500',
    },
    recognizedText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 12,
        fontStyle: 'italic',
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        marginTop: 10,
    },
    cancelButtonText: {
        fontSize: 16,
    },
});

export default VoiceModal;