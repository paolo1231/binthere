import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
    Dimensions,
    TouchableOpacity,
    Text,
    Modal,
    ScrollView,
    Image,
    TextInput,
    Alert,
    Platform
} from 'react-native';
import { launchCamera, launchImageLibrary, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';
import { requestCameraPermission, requestStoragePermission } from '../utils/permissions';
import { useTheme } from '../theme/ThemeProvider';
import { Item } from '../types';

interface ItemDetailModalProps {
    visible: boolean;
    onClose: () => void;
    item: Item | null;
    onMarkAsUsed: (item: Item) => void;
    onDelete: (id: string) => void;
    onUpdate?: (item: Item) => void;
}

const { height } = Dimensions.get('window');

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
    visible,
    onClose,
    item,
    onMarkAsUsed,
    onDelete,
    onUpdate
}) => {
    const { colors } = useTheme();
    const slideAnim = useRef(new Animated.Value(height)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    // State for editing
    const [isEditing, setIsEditing] = useState(false);
    const [editedLocation, setEditedLocation] = useState('');
    const [editedImageUri, setEditedImageUri] = useState<string | undefined>(undefined);

    // Reset editing state when modal opens
    useEffect(() => {
        if (visible && item) {
            setIsEditing(false);
            setEditedLocation(item.location);
            setEditedImageUri(item.imageUri);
        }
    }, [visible, item]);

    // Handle animations when visibility changes
    useEffect(() => {
        if (visible) {
            // Reset position before animating in
            slideAnim.setValue(height);
            backdropOpacity.setValue(0);

            // Animate in
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0.5,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Animate out
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: height,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleBackdropPress = () => {
        onClose();
    };

    const handleMarkAsUsed = () => {
        if (item) {
            onMarkAsUsed(item);
            onClose();
        }
    };

    const handleDelete = () => {
        if (item) {
            onDelete(item.id);
            onClose();
        }
    };

    if (!item) return null;

    const usageCount = item.usageHistory?.length || 0;
    const lastUsed = item.usageHistory && item.usageHistory.length > 0
        ? item.usageHistory[item.usageHistory.length - 1]
        : null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={handleBackdropPress}>
                <Animated.View
                    style={[
                        styles.backdrop,
                        {
                            backgroundColor: 'black',
                            opacity: backdropOpacity,
                        },
                    ]}
                />
            </TouchableWithoutFeedback>
            <Animated.View
                style={[
                    styles.container,
                    {
                        transform: [{ translateY: slideAnim }],
                        backgroundColor: colors.background,
                    },
                ]}
            >
                <View style={styles.handle} />

                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>

                    {/* Photo section */}
                    <View style={styles.photoContainer}>
                        {isEditing ? (
                            <>
                                {editedImageUri ? (
                                    <View style={styles.imageWrapper}>
                                        <Image
                                            source={{ uri: editedImageUri }}
                                            style={styles.itemImage}
                                            resizeMode="cover"
                                        />
                                        <TouchableOpacity
                                            style={[styles.removePhotoButton, { backgroundColor: colors.error }]}
                                            onPress={() => setEditedImageUri(undefined)}
                                        >
                                            <Text style={styles.removePhotoButtonText}>✕</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={[styles.photoPlaceholder, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                                        <Text style={{ color: colors.textSecondary }}>No Photo</Text>
                                    </View>
                                )}

                                <View style={styles.photoButtonsContainer}>
                                    <TouchableOpacity
                                        style={[styles.photoButton, { backgroundColor: colors.primary }]}
                                        onPress={async () => {
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
                                                    setEditedImageUri(result.assets[0].uri);
                                                } else {
                                                    console.log('No image URI found in result');
                                                    Alert.alert('Error', 'Failed to get image from camera');
                                                }
                                            } catch (error) {
                                                console.log('Camera error:', error);
                                                Alert.alert('Error', 'Failed to open camera');
                                            }
                                        }}
                                    >
                                        <Text style={styles.photoButtonText}>Take Photo</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.photoButton, { backgroundColor: colors.secondary }]}
                                        onPress={async () => {
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
                                                    setEditedImageUri(result.assets[0].uri);
                                                } else {
                                                    console.log('No image URI found in result');
                                                    Alert.alert('Error', 'Failed to get image from gallery');
                                                }
                                            } catch (error) {
                                                console.log('Gallery error:', error);
                                                Alert.alert('Error', 'Failed to open photo library');
                                            }
                                        }}
                                    >
                                        <Text style={styles.photoButtonText}>Choose Photo</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                {item.imageUri ? (
                                    <Image
                                        source={{ uri: item.imageUri }}
                                        style={styles.itemImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={[styles.photoPlaceholder, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                                        <Text style={{ color: colors.textSecondary }}>No Photo</Text>
                                    </View>
                                )}
                            </>
                        )}
                    </View>

                    <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                        <View style={styles.infoRow}>
                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Location:</Text>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.locationInput, {
                                        color: colors.text,
                                        borderColor: colors.cardBorder,
                                        backgroundColor: colors.background
                                    }]}
                                    value={editedLocation}
                                    onChangeText={setEditedLocation}
                                    placeholder="Enter location"
                                    placeholderTextColor={colors.textLight}
                                />
                            ) : (
                                <Text style={[styles.infoValue, { color: colors.text }]}>📍 {item.location}</Text>
                            )}
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Added:</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>{item.createdAt.toLocaleDateString()}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Times used:</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>{usageCount}</Text>
                        </View>

                        {lastUsed && (
                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Last used:</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>{lastUsed.toLocaleDateString()}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.actionsContainer}>
                        {isEditing ? (
                            <>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: colors.secondary }]}
                                    onPress={() => {
                                        if (onUpdate && item) {
                                            onUpdate({
                                                ...item,
                                                location: editedLocation,
                                                imageUri: editedImageUri
                                            });
                                        }
                                        setIsEditing(false);
                                    }}
                                >
                                    <Text style={styles.actionButtonText}>Save Changes</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: colors.error }]}
                                    onPress={() => {
                                        // Reset to original values
                                        setEditedLocation(item.location);
                                        setEditedImageUri(item.imageUri);
                                        setIsEditing(false);
                                    }}
                                >
                                    <Text style={styles.actionButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                                    onPress={() => setIsEditing(true)}
                                >
                                    <Text style={styles.actionButtonText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: colors.secondary }]}
                                    onPress={handleMarkAsUsed}
                                >
                                    <Text style={styles.actionButtonText}>Mark as Used</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: colors.error }]}
                                    onPress={handleDelete}
                                >
                                    <Text style={styles.actionButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    {!isEditing && (
                        <TouchableOpacity
                            style={[styles.cancelButton, { borderColor: colors.cardBorder }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Close</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '70%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 30,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    handle: {
        alignSelf: 'center',
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#ccc',
        marginTop: 10,
        marginBottom: 20,
    },
    contentContainer: {
        paddingBottom: 20,
    },
    itemName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    photoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    photoPlaceholder: {
        width: 200,
        height: 200,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: 10,
    },
    itemImage: {
        width: 200,
        height: 200,
        borderRadius: 12,
    },
    imageWrapper: {
        position: 'relative',
        marginBottom: 10,
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
    photoButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    photoButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    photoButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    locationInput: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 6,
        minWidth: 150,
        textAlign: 'right',
    },
    infoCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 16,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 6,
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        marginTop: 8,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default ItemDetailModal;