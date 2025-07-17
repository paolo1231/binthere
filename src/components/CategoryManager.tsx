import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    TextInput,
    Alert
} from 'react-native';
import { useItems } from '../context/ItemContext';
import { useTheme } from '../theme/ThemeProvider';
import { DEFAULT_CATEGORIES } from '../types';

interface CategoryManagerProps {
    visible: boolean;
    onClose: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ visible, onClose }) => {
    const { state, dispatch } = useItems();
    const { colors } = useTheme();
    const [categories, setCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState('');

    // Get unique categories from items
    useEffect(() => {
        const uniqueCategories = new Set<string>();

        // Add default categories
        DEFAULT_CATEGORIES.forEach(category => uniqueCategories.add(category));

        // Add categories from items
        state.items.forEach(item => {
            if (item.category) {
                uniqueCategories.add(item.category);
            }
        });

        setCategories(Array.from(uniqueCategories).sort());
    }, [state.items]);

    const handleAddCategory = () => {
        if (!newCategory.trim()) {
            Alert.alert('Error', 'Please enter a category name');
            return;
        }

        if (categories.includes(newCategory.trim())) {
            Alert.alert('Error', 'This category already exists');
            return;
        }

        setCategories([...categories, newCategory.trim()].sort());
        setNewCategory('');
    };

    const handleSelectCategory = (category: string) => {
        dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category });
        onClose();
    };

    const renderCategoryItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={[
                styles.categoryItem,
                { borderColor: colors.cardBorder }
            ]}
            onPress={() => handleSelectCategory(item)}
        >
            <Text style={[styles.categoryText, { color: colors.text }]}>{item}</Text>
            <View style={styles.categoryCount}>
                <Text style={[styles.categoryCountText, { color: colors.textSecondary }]}>
                    {state.items.filter(i => i.category === item).length}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View
                    style={[
                        styles.modalContent,
                        { backgroundColor: colors.background, borderColor: colors.cardBorder }
                    ]}
                >
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Categories</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.addCategoryContainer}>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    borderColor: colors.cardBorder,
                                    color: colors.text,
                                    backgroundColor: colors.card
                                }
                            ]}
                            placeholder="New category name..."
                            placeholderTextColor={colors.textLight}
                            value={newCategory}
                            onChangeText={setNewCategory}
                        />
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: colors.primary }]}
                            onPress={handleAddCategory}
                        >
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        Available Categories
                    </Text>

                    <FlatList
                        data={categories}
                        renderItem={renderCategoryItem}
                        keyExtractor={(item) => item}
                        style={styles.categoryList}
                        ListEmptyComponent={
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                No categories available
                            </Text>
                        }
                    />

                    <TouchableOpacity
                        style={[styles.clearButton, { borderColor: colors.cardBorder }]}
                        onPress={() => {
                            dispatch({ type: 'SET_SELECTED_CATEGORY', payload: '' });
                            onClose();
                        }}
                    >
                        <Text style={{ color: colors.textSecondary }}>Show All Items</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxHeight: '80%',
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        fontSize: 24,
        padding: 4,
    },
    addCategoryContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginRight: 8,
        fontSize: 16,
    },
    addButton: {
        borderRadius: 8,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 60,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    categoryList: {
        marginBottom: 16,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    categoryText: {
        fontSize: 16,
    },
    categoryCount: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    categoryCountText: {
        fontSize: 12,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
    },
    clearButton: {
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
    },
});

export default CategoryManager;