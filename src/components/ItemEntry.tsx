import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useItems } from '../context/ItemContext';
import { useTheme } from '../theme/ThemeProvider';
import { requestCameraPermission } from '../utils/permissions';
import CategorySelector from './CategorySelector';

interface ItemEntryProps {
    onItemAdded?: () => void;
}

const ItemEntry: React.FC<ItemEntryProps> = ({ onItemAdded }) => {
    const { addItem } = useItems();
    const { colors } = useTheme();
    const [itemName, setItemName] = useState('');
    const [itemLocation, setItemLocation] = useState('');
    const [itemCategory, setItemCategory] = useState('');
    const [imageUri, setImageUri] = useState<string | undefined>(undefined);

    const handleAddItem = () => {
        if (!itemName.trim() || !itemLocation.trim()) {
            Alert.alert('Error', 'Please enter both item name and location');
            return;
        }

        addItem({
            name: itemName.trim(),
            location: itemLocation.trim(),
            category: itemCategory,
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
        try {
            // Request camera permission first
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) {
                console.log('Camera permission denied');
                return;
            }

            console.log('Launching camera...');
            launchCamera({
                mediaType: 'photo',
                quality: 0.8,
                saveToPhotos: true,
                includeBase64: false,
            }, (response) => {
                console.log('Camera response:', response);

                if (response.didCancel) {
                    console.log('User cancelled camera');
                    return;
                }

                if (response.errorCode) {
                    console.log('Camera error:', response.errorMessage);
                    Alert.alert('Error', response.errorMessage || 'Unknown error');
                    return;
                }

                if (response.assets && response.assets[0]?.uri) {
                    console.log('Setting image URI:', response.assets[0].uri);
                    setImageUri(response.assets[0].uri);
                } else {
                    console.log('No image URI found in response');
                    Alert.alert('Error', 'Failed to get image from camera');
                }
            });
        } catch (error) {
            console.log('Camera error:', error);
            Alert.alert('Error', 'Failed to open camera');
        }
    };

    const selectFromGallery = async () => {
        try {
            // For Android 13+ (API level 33+), we don't need to request permissions for image picker
            console.log('Launching image library...');
            launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
                selectionLimit: 1,
                includeBase64: false,
                presentationStyle: 'fullScreen',
            }, (response) => {
                console.log('Gallery response:', response);

                if (response.didCancel) {
                    console.log('User cancelled gallery');
                    return;
                }

                if (response.errorCode) {
                    console.log('Gallery error:', response.errorMessage);
                    Alert.alert('Error', response.errorMessage || 'Unknown error');
                    return;
                }

                if (response.assets && response.assets[0]?.uri) {
                    console.log('Setting image URI:', response.assets[0].uri);
                    setImageUri(response.assets[0].uri);
                } else {
                    console.log('No image URI found in response');
                    Alert.alert('Error', 'Failed to get image from gallery');
                }
            });
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

            {/* Photo section - Always visible */}
            <View style={styles.photoSection}>
                {imageUri ? (
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
                ) : (
                    <TouchableOpacity
                        style={[styles.photoPlaceholder, { borderColor: colors.cardBorder }]}
                        onPress={handlePhotoEntry}
                    >
                        <Text style={styles.photoPlaceholderIcon}>📷</Text>
                        <Text style={[styles.photoPlaceholderText, { color: colors.textSecondary }]}>
                            Add a photo (recommended)
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

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

            <CategorySelector
                selectedCategory={itemCategory}
                onSelectCategory={setItemCategory}
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
    photoSection: {
        alignItems: 'center',
        marginBottom: 16,
    },
    photoPlaceholder: {
        width: 200,
        height: 160,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.03)',
    },
    photoPlaceholderIcon: {
        fontSize: 40,
        marginBottom: 10,
    },
    photoPlaceholderText: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
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