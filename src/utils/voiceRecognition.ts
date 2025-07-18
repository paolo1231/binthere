import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';

export interface VoiceRecognitionResult {
    success: boolean;
    results: string[];
    error?: string;
}

/**
 * Initialize voice recognition
 */
export const initVoiceRecognition = async (): Promise<void> => {
    try {
        await Voice.destroy();
        await Voice.removeAllListeners();
    } catch (error) {
        console.error('Error initializing voice recognition:', error);
    }
};

/**
 * Start voice recognition
 * @param locale The locale to use for voice recognition (default: 'en-US')
 */
export const startVoiceRecognition = async (locale: string = 'en-US'): Promise<void> => {
    try {
        await Voice.start(locale);
    } catch (error) {
        console.error('Error starting voice recognition:', error);
        throw error;
    }
};

/**
 * Stop voice recognition
 */
export const stopVoiceRecognition = async (): Promise<void> => {
    try {
        await Voice.stop();
    } catch (error) {
        console.error('Error stopping voice recognition:', error);
    }
};

/**
 * Destroy voice recognition
 */
export const destroyVoiceRecognition = async (): Promise<void> => {
    try {
        await Voice.destroy();
    } catch (error) {
        console.error('Error destroying voice recognition:', error);
    }
};

/**
 * Set up voice recognition event listeners
 * @param onSpeechStart Callback for when speech recognition starts
 * @param onSpeechResults Callback for when speech results are available
 * @param onSpeechError Callback for when speech recognition errors occur
 * @param onSpeechEnd Callback for when speech recognition ends
 */
export const setupVoiceListeners = (
    onSpeechStart?: () => void,
    onSpeechResults?: (results: SpeechResultsEvent) => void,
    onSpeechError?: (error: any) => void,
    onSpeechEnd?: () => void,
) => {
    Voice.onSpeechStart = onSpeechStart || (() => { });
    Voice.onSpeechResults = onSpeechResults || (() => { });
    Voice.onSpeechError = onSpeechError || (() => { });
    Voice.onSpeechEnd = onSpeechEnd || (() => { });
};

/**
 * Remove all voice recognition event listeners
 */
export const removeVoiceListeners = async (): Promise<void> => {
    try {
        await Voice.removeAllListeners();
    } catch (error) {
        console.error('Error removing voice listeners:', error);
    }
};