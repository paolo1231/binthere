import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { DEFAULT_CATEGORIES } from '../types';
import { useTheme } from '../theme/ThemeProvider';

interface CategorySelectorProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelectCategory }) => {
    const { colors } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);

    const handleCategorySelect = (category: string) => {
        onSelectCategory(category);
        setModalVisible(false);
    };

    const renderCategoryItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={[
                styles.categoryItem,
                selectedCategory === item && { backgroundColor: colors.primary + '20' }
            ]}
            onPress={() => handleCategorySelect(item)}
        >
            <Text
                style={[
                    styles.categoryText,
                    { color: colors.text },
                    selectedCategory === item && { color: colors.primary, fontWeight: 'bold' }
                ]}
            >
                {item}
            </Text>
            {selectedCategory === item && (
                <Text style={styles.checkmark}>✓</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.selector,
                    { borderColor: colors.cardBorder, backgroundColor: colors.card }
                ]}
                onPress={() => setModalVisible(true)}
            >
                <Text style={[styles.selectorText, { color: selectedCategory ? colors.text : colors.textLight }]}>
                    {selectedCategory || 'Select category...'}
                </Text>
                <Text style={[styles.dropdownIcon, { color: colors.textSecondary }]}>▼</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View
                        style={[
                            styles.modalContent,
                            { backgroundColor: colors.background, borderColor: colors.cardBorder }
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Category</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={DEFAULT_CATEGORIES}
                            renderItem={renderCategoryItem}
                            keyExtractor={(item) => item}
                            style={styles.categoryList}
                        />

                        <TouchableOpacity
                            style={[styles.clearButton, { borderColor: colors.cardBorder }]}
                            onPress={() => handleCategorySelect('')}
                        >
                            <Text style={{ color: colors.textSecondary }}>Clear Selection</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    selector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
    },
    selectorText: {
        fontSize: 16,
    },
    dropdownIcon: {
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        maxHeight: '70%',
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        fontSize: 20,
        padding: 4,
    },
    categoryList: {
        marginBottom: 16,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    categoryText: {
        fontSize: 16,
    },
    checkmark: {
        color: 'green',
        fontSize: 18,
    },
    clearButton: {
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
    },
});

export default CategorySelector;