import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { useItems } from '../context/ItemContext';

const ItemEntry = () => {
    const { addItem } = useItems();
    const [itemName, setItemName] = useState('');
    const [itemLocation, setItemLocation] = useState('');

    const handleAddItem = () => {
        if (!itemName.trim() || !itemLocation.trim()) {
            Alert.alert('Error', 'Please enter both item name and location');
            return;
        }

        addItem({
            name: itemName.trim(),
            location: itemLocation.trim(),
        });

        setItemName('');
        setItemLocation('');
        Alert.alert('Success', 'Item added successfully!');
    };

    const handleVoiceEntry = () => {
        Alert.alert('Voice Entry', 'Voice recognition coming soon!');
    };

    const handlePhotoEntry = () => {
        Alert.alert('Photo Entry', 'Camera functionality coming soon!');
    };

    const handleBarcodeEntry = () => {
        Alert.alert('Barcode Entry', 'Barcode scanning coming soon!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quick Item Entry</Text>

            <TextInput
                style={styles.input}
                placeholder="Item name..."
                value={itemName}
                onChangeText={setItemName}
            />

            <TextInput
                style={styles.input}
                placeholder="Location (room, shelf, box, etc.)..."
                value={itemLocation}
                onChangeText={setItemLocation}
            />

            <Button title="Add Item" onPress={handleAddItem} />

            <View style={styles.buttonRow}>
                <Button title="Add by Voice" onPress={handleVoiceEntry} />
                <Button title="Add by Photo" onPress={handlePhotoEntry} />
                <Button title="Add by Barcode" onPress={handleBarcodeEntry} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    title: { fontWeight: 'bold', marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 8
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8
    },
});

export default ItemEntry;