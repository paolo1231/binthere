import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Request microphone permission for Android devices
 * @returns Promise<boolean> - true if permission is granted, false otherwise
 */
export const requestMicrophonePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
        // iOS handles permissions through Info.plist
        return true;
    }

    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
                title: 'Microphone Permission',
                message: 'This app needs access to your microphone to enable voice recognition.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        console.error('Error requesting microphone permission:', err);
        return false;
    }
};