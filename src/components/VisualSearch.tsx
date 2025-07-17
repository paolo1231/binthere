import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    Image,
    Alert
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../theme/ThemeProvider';
import { useItems } from '../context/ItemContext';
import { analyzeImage, searchSimilarItems } from '../utils/visionApi';
import { requestCameraPermission } from '../utils/permissions';

interface VisualSearchProps {
    visible: boolean;
    onClose: () => void;
}

const VisualSearch: React.FC<VisualSearchProps> = ({ visible, onClose }) => {
    const { colors } = useTheme();
    const { state } = useItems();
    const [imageUri, setImageUri] = useState<string | undefined>(undefined);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState<any>(null);
    const [matchingItems, setMatchingItems] = useState<any[]>([]);

    const handleTakePhoto = async () => {
        try {
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) {
                console.log('Camera permission denied');
                return;
            }

            launchCamera({
                mediaType: 'photo',
                quality: 0.8,
                saveToPhotos: true,
            }, (response) => {
                if (response.didCancel || response.errorCode) return;

                if (response.assets && response.assets[0]?.uri) {
                    setImageUri(response.assets[0].uri);
                    analyzeImageAndFindMatches(response.assets[0].uri);
                }
            });
        } catch (error) {
            console.log('Camera error:', error);
            Alert.alert('Error', 'Failed to open camera');
        }
    };

    const handleChoosePhoto = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
            selectionLimit: 1,
        }, (response) => {
            if (response.didCancel || response.errorCode) return;

            if (response.assets && response.assets[0]?.uri) {
                setImageUri(response.assets[0].uri);
                analyzeImageAndFindMatches(response.assets[0].uri);
            }
        });
    };

    const analyzeImageAndFindMatches = async (uri: string) => {
        setIsAnalyzing(true);

        try {
            // Analyze the image
            const analysis = await analyzeImage(uri);
            setAnalysisResults(analysis);

            // Find similar items in the user's inventory
            const similarItemIds = await searchSimilarItems(uri);

            // Map the IDs to actual items from the state
            const items = state.items.filter(item => {
                // In a real app, you would match by ID
                // For demo, we'll match if any of the labels are in the item name
                return analysis.labels.some(label =>
                    item.name.toLowerCase().includes(label.toLowerCase())
                );
            });

            setMatchingItems(items);
        } catch (error) {
            console.error('Error analyzing image:', error);
            Alert.alert('Error', 'Failed to analyze image');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetSearch = () => {
        setImageUri(undefined);
        setAnalysisResults(null);
        setMatchingItems([]);
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Visual Search</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={{ fontSize: 18, color: colors.textSecondary }}>✕</Text>
                    </TouchableOpacity>
                </View>

                {!imageUri ? (
                    <View style={styles.optionsContainer}>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Search for items using an image
                        </Text>

                        <TouchableOpacity
                            style={[styles.optionButton, { backgroundColor: colors.primary }]}
                            onPress={handleTakePhoto}
                        >
                            <Text style={styles.optionButtonText}>Take Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.optionButton, { backgroundColor: colors.secondary }]}
                            onPress={handleChoosePhoto}
                        >
                            <Text style={styles.optionButtonText}>Choose from Gallery</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.resultsContainer}>
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.previewImage}
                            resizeMode="cover"
                        />

                        {isAnalyzing ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={colors.primary} />
                                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                                    Analyzing image...
                                </Text>
                            </View>
                        ) : (
                            <>
                                {analysisResults && (
                                    <View style={[styles.analysisContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                                        <Text style={[styles.analysisTitle, { color: colors.text }]}>
                                            Image Analysis
                                        </Text>

                                        <View style={styles.labelsContainer}>
                                            {analysisResults.labels.map((label: string, index: number) => (
                                                <View
                                                    key={index}
                                                    style={[styles.labelChip, { backgroundColor: colors.primary + '20' }]}
                                                >
                                                    <Text style={[styles.labelText, { color: colors.primary }]}>
                                                        {label}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>

                                        {analysisResults.category && (
                                            <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
                                                Suggested Category: {analysisResults.category}
                                            </Text>
                                        )}
                                    </View>
                                )}

                                <View style={styles.matchesSection}>
                                    <Text style={[styles.matchesTitle, { color: colors.text }]}>
                                        {matchingItems.length > 0
                                            ? `Found ${matchingItems.length} similar items`
                                            : 'No similar items found'}
                                    </Text>

                                    {matchingItems.length > 0 && (
                                        <View style={styles.matchesList}>
                                            {matchingItems.map((item) => (
                                                <View
                                                    key={item.id}
                                                    style={[styles.matchItem, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                                                >
                                                    <Text style={[styles.matchItemName, { color: colors.text }]}>
                                                        {item.name}
                                                    </Text>
                                                    <Text style={[styles.matchItemLocation, { color: colors.textSecondary }]}>
                                                        📍 {item.location}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={[styles.newSearchButton, { backgroundColor: colors.secondary }]}
                                    onPress={resetSearch}
                                >
                                    <Text style={styles.newSearchButtonText}>New Search</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        paddingTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    optionsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    optionButton: {
        width: '80%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    optionButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    resultsContainer: {
        flex: 1,
        alignItems: 'center',
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 12,
        marginBottom: 16,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 24,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    analysisContainer: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 16,
    },
    analysisTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    labelsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    labelChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    labelText: {
        fontSize: 14,
        fontWeight: '500',
    },
    categoryText: {
        fontSize: 16,
        marginTop: 8,
    },
    matchesSection: {
        width: '100%',
        marginTop: 8,
    },
    matchesTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    matchesList: {
        width: '100%',
    },
    matchItem: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 8,
    },
    matchItemName: {
        fontSize: 16,
        fontWeight: '500',
    },
    matchItemLocation: {
        fontSize: 14,
        marginTop: 4,
    },
    newSearchButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 24,
    },
    newSearchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default VisualSearch;