import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useItems } from '../context/ItemContext';

const SearchBar = () => {
    const { state, dispatch } = useItems();

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search items..."
                value={state.searchQuery}
                onChangeText={(text) => dispatch({ type: 'SET_SEARCH_QUERY', payload: text })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8 },
});

export default SearchBar;