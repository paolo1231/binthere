import { Platform, PermissionsAndroid, Alert } from 'react-native';

export const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
        return true;
    }

    try {
        // Request camera permission - this is the only essential permission for camera functionality
        const cameraGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "Camera Permission",
                message: "Bin There needs access to your camera to take photos of your items.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );

        if (cameraGranted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Camera permission granted");
            return true;
        } else {
            console.log("Camera permission denied");
            Alert.alert(
                "Permission Required",
                "Camera permission is required to take photos. Please enable it in your device settings."
            );
            return false;
        }
    } catch (err) {
        console.warn("Error requesting camera permissions:", err);
        return false;
    }
};

export const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
        return true;
    }

    try {
        // For Android, we'll just request READ_EXTERNAL_STORAGE
        // This is the most compatible approach across Android versions
        const readGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                title: "Storage Permission",
                message: "Bin There needs access to your photos to select images for your items.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );

        if (readGranted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Storage permission granted");
            return true;
        } else {
            console.log("Storage permission denied");
            Alert.alert(
                "Permission Required",
                "Storage permission is required to select photos. Please enable it in your device settings."
            );
            return false;
        }
    } catch (err) {
        console.warn("Error requesting storage permissions:", err);
        return false;
    }
};