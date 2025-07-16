import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ItemEntry = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Quick Item Entry</Text>
        <Button title="Add by Voice" onPress={() => { }} />
        <Button title="Add by Photo" onPress={() => { }} />
        <Button title="Add by Barcode" onPress={() => { }} />
    </View>
);

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    title: { fontWeight: 'bold', marginBottom: 8 },
});

export default ItemEntry;