import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = () => (
    <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Search items..." />
    </View>
);

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8 },
});

export default SearchBar;