import { Platform, PermissionsAndroid, Alert } from 'react-native';

export const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
        return true;
    }

    try {
        // Request both camera and storage permissions together
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

        const storageGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: "Storage Permission",
                message: "Bin There needs access to your storage to save photos.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );

        if (
            cameraGranted === PermissionsAndroid.RESULTS.GRANTED &&
            storageGranted === PermissionsAndroid.RESULTS.GRANTED
        ) {
            console.log("Camera and storage permissions granted");
            return true;
        } else {
            console.log("Camera or storage permission denied");
            Alert.alert(
                "Permission Required",
                "Camera and storage permissions are required to take photos. Please enable them in your device settings."
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
        // Request both read and write storage permissions
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

        const writeGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: "Storage Permission",
                message: "Bin There needs access to your storage to save photos.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );

        if (
            readGranted === PermissionsAndroid.RESULTS.GRANTED &&
            writeGranted === PermissionsAndroid.RESULTS.GRANTED
        ) {
            console.log("Storage permissions granted");
            return true;
        } else {
            console.log("Storage permission denied");
            Alert.alert(
                "Permission Required",
                "Storage permissions are required to select photos. Please enable them in your device settings."
            );
            return false;
        }
    } catch (err) {
        console.warn("Error requesting storage permissions:", err);
        return false;
    }
};