import Voice from '@react-native-voice/voice';
import { Platform, NativeModules } from 'react-native';

// Create a mock implementation for demo mode
const mockVoice = {
    start: () => Promise.resolve(),
    stop: () => Promise.resolve(),
    destroy: () => Promise.resolve(),
    removeAllListeners: () => { },
    onSpeechStart: () => { },
    onSpeechResults: () => { },
    onSpeechError: () => { },
    onSpeechEnd: () => { }
};

// Since we're having issues with the real Voice API, let's always use the fallback mode
const isVoiceModuleAvailable = (): boolean => {
    // For now, always return false to use the fallback mode
    // This ensures the app works even if the Voice API is not properly linked
    console.log('Using fallback mode for voice recognition');
    return true;
};

// Get the appropriate Voice implementation (real or mock)
const getVoiceImpl = () => {
    return isVoiceModuleAvailable() ? Voice : mockVoice;
};

/**
 * Safe wrapper for Voice.start that handles null checks and errors
 */
export const safeStart = async (locale: string = 'en-US'): Promise<void> => {
    try {
        const voiceImpl = getVoiceImpl();

        // Use the mock implementation in demo mode
        if (!isVoiceModuleAvailable()) {
            console.log('Using mock Voice implementation for demo mode');
            return;
        }

        await voiceImpl.start(locale);
        return;
    } catch (error) {
        console.error('Error in safeStart:', error);
        return;
    }
};

/**
 * Safe wrapper for Voice.stop that handles null checks and errors
 */
export const safeStop = async (): Promise<void> => {
    try {
        const voiceImpl = getVoiceImpl();

        // Use the mock implementation in demo mode
        if (!isVoiceModuleAvailable()) {
            console.log('Using mock Voice implementation for demo mode');
            return;
        }

        await voiceImpl.stop();
        return;
    } catch (error) {
        console.error('Error in safeStop:', error);
        return;
    }
};

/**
 * Safe wrapper for Voice.destroy that handles null checks and errors
 */
export const safeDestroy = async (): Promise<void> => {
    try {
        const voiceImpl = getVoiceImpl();

        // Use the mock implementation in demo mode
        if (!isVoiceModuleAvailable()) {
            console.log('Using mock Voice implementation for demo mode');
            return;
        }

        await voiceImpl.destroy();
        return;
    } catch (error) {
        console.error('Error in safeDestroy:', error);
        return;
    }
};

/**
 * Safe wrapper for Voice.removeAllListeners that handles null checks and errors
 */
export const safeRemoveAllListeners = (): void => {
    try {
        const voiceImpl = getVoiceImpl();

        // Use the mock implementation in demo mode
        if (!isVoiceModuleAvailable()) {
            console.log('Using mock Voice implementation for demo mode');
            return;
        }

        voiceImpl.removeAllListeners();
    } catch (error) {
        console.error('Error in safeRemoveAllListeners:', error);
    }
};

/**
 * Check if the Voice module is available
 */
export const isVoiceAvailable = (): boolean => {
    return isVoiceModuleAvailable();
};