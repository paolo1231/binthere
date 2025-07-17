import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useItems } from '../context/ItemContext';
import { DEFAULT_CATEGORIES } from '../types';

interface CategoryManagerProps {
    visible: boolean;
    onClose: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ visible, onClose }) => {
    const { colors } = useTheme();
    const { state } = useItems();
    const [categories, setCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [categoryUsage, setCategoryUsage] = useState<Record<string, number>>({});

    // Load categories and calculate usage
    useEffect(() => {
        if (visible) {
            // Get unique categories from items and default categories
            const uniqueCategories = new Set<string>();

            // Add default categories
            DEFAULT_CATEGORIES.forEach(category => uniqueCategories.add(category));

            // Add categories from items
            state.items.forEach(item => {
                if (item.category) {
                    uniqueCategories.add(item.category);
                }
            });

            // Sort categories alphabetically
            const sortedCategories = Array.from(uniqueCategories).sort();
            setCategories(sortedCategories);

            // Calculate category usage
            const usage: Record<string, number> = {};
            state.items.forEach(item => {
                if (item.category) {
                    usage[item.category] = (usage[item.category] || 0) + 1;
                }
            });
            setCategoryUsage(usage);
        }
    }, [visible, state.items]);

    const handleAddCategory = () => {
        if (!newCategory.trim()) {
            Alert.alert('Error', 'Please enter a category name');
            return;
        }

        if (categories.includes(newCategory.trim())) {
            Alert.alert('Error', 'This category already exists');
            return;
        }

        // Add the new category
        const updatedCategories = [...categories, newCategory.trim()].sort();
        setCategories(updatedCategories);
        setNewCategory('');

        Alert.alert('Success', `Category "${newCategory.trim()}" added successfully`);
    };

    const renderCategoryItem = ({ item }: { item: string }) => {
        const itemCount = categoryUsage[item] || 0;

        return (
            <View
                style={[
                    styles.categoryItem,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.cardBorder
                    }
                ]}
            >
                <Text style={[styles.categoryName, { color: colors.text }]}>{item}</Text>
                <View style={styles.categoryDetails}>
                    <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Manage Categories</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={{ fontSize: 18, color: colors.textSecondary }}>✕</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.addCategorySection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Add New Category</Text>
                    <View style={styles.addCategoryRow}>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    borderColor: colors.cardBorder,
                                    color: colors.text,
                                    backgroundColor: colors.card
                                }
                            ]}
                            placeholder="Category name..."
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
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>
                    Your Categories
                </Text>

                <FlatList
                    data={categories}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item}
                    style={styles.categoryList}
                    ListEmptyComponent={
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            No categories found
                        </Text>
                    }
                />

                <TouchableOpacity
                    style={[styles.closeButton, { backgroundColor: colors.secondary }]}
                    onPress={onClose}
                >
                    <Text style={styles.closeButtonText}>Done</Text>
                </TouchableOpacity>
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    addCategorySection: {
        marginBottom: 16,
    },
    addCategoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 12,
    },
    addButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    addButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    categoryList: {
        flex: 1,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 8,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '500',
    },
    categoryDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryCount: {
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
    },
    closeButton: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CategoryManager;