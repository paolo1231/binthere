import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ItemEntry from '../components/ItemEntry';
import SearchBar from '../components/SearchBar';
import ItemList from '../components/ItemList';

const HomeScreen = () => (
    <View style={styles.container}>
        <Text style={styles.header}>Iteminder</Text>
        <ItemEntry />
        <SearchBar />
        <ItemList />
    </View>
);

const styles = StyleSheet.create({
    container: { padding: 16, flex: 1 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});

export default HomeScreen;