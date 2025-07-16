import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Image, Platform } from 'react-native';
import { launchCamera, launchImageLibrary, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';
import { useItems } from '../context/ItemContext';
import { useTheme } from '../theme/ThemeProvider';
import { requestCameraPermission, requestStoragePermission } from '../utils/permissions';

interface ItemEntryProps {
    onItemAdded?: () => void;
}

const ItemEntry: React.FC<ItemEntryProps> = ({ onItemAdded }) => {
    const { addItem } = useItems();
    const { colors } = useTheme();
    const [itemName, setItemName] = useState('');
    const [itemLocation, setItemLocation] = useState('');
    const [imageUri, setImageUri] = useState<string | undefined>(undefined);

    const handleAddItem = () => {
        if (!itemName.trim() || !itemLocation.trim()) {
            Alert.alert('Error', 'Please enter both item name and location');
            return;
        }

        addItem({
            name: itemName.trim(),
            location: itemLocation.trim(),
            imageUri: imageUri,
        });

        setItemName('');
        setItemLocation('');
        setImageUri(undefined);
        Alert.alert('Success', 'Item added successfully!', [
            { text: 'OK', onPress: () => onItemAdded && onItemAdded() }
        ]);
    };

    const handleVoiceEntry = () => {
        Alert.alert('Voice Entry', 'Voice recognition coming soon!');
    };

    const takePicture = async () => {
        // Request camera permission first
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;

        try {
            const options: CameraOptions = {
                mediaType: 'photo',
                quality: 0.8,
                saveToPhotos: true,
                includeBase64: false,
            };

            const result = await launchCamera(options);
            console.log('Camera result:', result);

            if (result.didCancel) {
                console.log('User cancelled camera');
                return;
            }

            if (result.errorCode) {
                console.log('Camera error:', result.errorMessage);
                Alert.alert('Error', result.errorMessage || 'Unknown error');
                return;
            }

            if (result.assets && result.assets[0]?.uri) {
                console.log('Setting image URI:', result.assets[0].uri);
                setImageUri(result.assets[0].uri);
            } else {
                console.log('No image URI found in result');
                Alert.alert('Error', 'Failed to get image from camera');
            }
        } catch (error) {
            console.log('Camera error:', error);
            Alert.alert('Error', 'Failed to open camera');
        }
    };

    const selectFromGallery = async () => {
        // Request storage permission first
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) return;

        try {
            const options: ImageLibraryOptions = {
                mediaType: 'photo',
                quality: 0.8,
                selectionLimit: 1,
                includeBase64: false,
            };

            const result = await launchImageLibrary(options);
            console.log('Gallery result:', result);

            if (result.didCancel) {
                console.log('User cancelled gallery');
                return;
            }

            if (result.errorCode) {
                console.log('Gallery error:', result.errorMessage);
                Alert.alert('Error', result.errorMessage || 'Unknown error');
                return;
            }

            if (result.assets && result.assets[0]?.uri) {
                console.log('Setting image URI:', result.assets[0].uri);
                setImageUri(result.assets[0].uri);
            } else {
                console.log('No image URI found in result');
                Alert.alert('Error', 'Failed to get image from gallery');
            }
        } catch (error) {
            console.log('Gallery error:', error);
            Alert.alert('Error', 'Failed to open photo library');
        }
    };

    const handlePhotoEntry = () => {
        Alert.alert(
            'Add Photo',
            'Choose a photo source',
            [
                {
                    text: 'Camera',
                    onPress: takePicture
                },
                {
                    text: 'Photo Library',
                    onPress: selectFromGallery
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        );
    };

    const handleBarcodeEntry = () => {
        Alert.alert('Barcode Entry', 'Barcode scanning coming soon!');
    };

    return (
        <View style={styles.container}>
            {/* Title is now in the modal header */}

            {/* Photo preview */}
            {imageUri && (
                <View style={styles.imagePreviewContainer}>
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.imagePreview}
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        style={[styles.removePhotoButton, { backgroundColor: colors.error }]}
                        onPress={() => setImageUri(undefined)}
                    >
                        <Text style={styles.removePhotoButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TextInput
                style={[styles.input, { borderColor: colors.cardBorder, color: colors.text }]}
                placeholder="Item name..."
                placeholderTextColor={colors.textLight}
                value={itemName}
                onChangeText={setItemName}
            />

            <TextInput
                style={[styles.input, { borderColor: colors.cardBorder, color: colors.text }]}
                placeholder="Location (room, shelf, box, etc.)..."
                placeholderTextColor={colors.textLight}
                value={itemLocation}
                onChangeText={setItemLocation}
            />

            <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={handleAddItem}
            >
                <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.cardBorder }]} />
                <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or add using</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.cardBorder }]} />
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: colors.accent }]}
                    onPress={handleVoiceEntry}
                >
                    <Text style={styles.iconButtonText}>🎤</Text>
                    <Text style={styles.iconButtonLabel}>Voice</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: colors.secondary }]}
                    onPress={handlePhotoEntry}
                >
                    <Text style={styles.iconButtonText}>📷</Text>
                    <Text style={styles.iconButtonLabel}>Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: colors.info }]}
                    onPress={handleBarcodeEntry}
                >
                    <Text style={styles.iconButtonText}>📊</Text>
                    <Text style={styles.iconButtonLabel}>Barcode</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    imagePreviewContainer: {
        alignItems: 'center',
        marginBottom: 16,
        position: 'relative',
    },
    imagePreview: {
        width: 200,
        height: 200,
        borderRadius: 12,
    },
    removePhotoButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removePhotoButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 16,
        fontSize: 18
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16
    },
    addButton: {
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        marginTop: 4
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20
    },
    dividerLine: {
        flex: 1,
        height: 1
    },
    dividerText: {
        marginHorizontal: 10,
        fontSize: 14
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8
    },
    iconButton: {
        width: 80,
        height: 80,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconButtonText: {
        fontSize: 24,
        marginBottom: 4
    },
    iconButtonLabel: {
        color: 'white',
        fontWeight: '500'
    }
});

export default ItemEntry;