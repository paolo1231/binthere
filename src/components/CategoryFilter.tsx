import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useItems } from '../context/ItemContext';
import { useTheme } from '../theme/ThemeProvider';
import { DEFAULT_CATEGORIES } from '../types';
import CategoryManager from './CategoryManager';

const CategoryFilter: React.FC = () => {
    const { state, dispatch, filteredItems } = useItems();
    const { colors } = useTheme();
    const [categories, setCategories] = useState<string[]>([]);
    const [isCategoryManagerVisible, setIsCategoryManagerVisible] = useState(false);

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

    const handleCategoryPress = (category: string) => {
        if (state.selectedCategory === category) {
            // If the same category is pressed again, clear the filter
            dispatch({ type: 'SET_SELECTED_CATEGORY', payload: '' });
        } else {
            dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={[styles.title, { color: colors.text }]}>Filter by Category</Text>
                <TouchableOpacity
                    style={[styles.manageButton, { backgroundColor: colors.secondary }]}
                    onPress={() => setIsCategoryManagerVisible(true)}
                >
                    <Text style={styles.manageButtonText}>Manage</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <TouchableOpacity
                    style={[
                        styles.categoryChip,
                        { borderColor: colors.cardBorder },
                        !state.selectedCategory && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: '' })}
                >
                    <Text
                        style={[
                            styles.categoryText,
                            { color: !state.selectedCategory ? colors.background : colors.text }
                        ]}
                    >
                        All
                    </Text>
                </TouchableOpacity>

                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryChip,
                            { borderColor: colors.cardBorder },
                            state.selectedCategory === category && { backgroundColor: colors.primary }
                        ]}
                        onPress={() => handleCategoryPress(category)}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                { color: state.selectedCategory === category ? colors.background : colors.text }
                            ]}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Category Manager Modal */}
            <CategoryManager
                visible={isCategoryManagerVisible}
                onClose={() => setIsCategoryManagerVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
    },
    manageButton: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    manageButtonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 12,
    },
    scrollContent: {
        paddingRight: 16,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default CategoryFilter;