import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const FilterPanel = () => (
    <View style={styles.container}>
        <Text style={styles.label}>Filter Items</Text>
        <Button title="By Location" onPress={() => { }} />
        <Button title="By Date" onPress={() => { }} />
    </View>
);

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    label: { marginBottom: 4 },
});

export default FilterPanel;