import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useItems } from '../context/ItemContext';
import { useTheme } from '../theme/ThemeProvider';

const SearchBar = () => {
    const { state, dispatch } = useItems();
    const { colors } = useTheme();

    const handleClearSearch = () => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.card, borderRadius: 12 }]}>
            <View style={styles.searchInputContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Search items or locations..."
                    placeholderTextColor={colors.textLight}
                    value={state.searchQuery}
                    onChangeText={(text) => dispatch({ type: 'SET_SEARCH_QUERY', payload: text })}
                />
                {state.searchQuery ? (
                    <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                        <Text style={styles.clearButtonText}>✕</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 10
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 8
    },
    input: {
        flex: 1,
        height: 44,
        fontSize: 16,
        padding: 8,
        backgroundColor: 'transparent'
    },
    clearButton: {
        padding: 6
    },
    clearButtonText: {
        fontSize: 16,
        color: '#888'
    }
});

export default SearchBar;