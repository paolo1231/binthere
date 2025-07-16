import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const LocationTagger = () => (
    <View style={styles.container}>
        <Text style={styles.label}>Location Tag (room, shelf, box, etc.)</Text>
        <TextInput style={styles.input} placeholder="Enter location..." />
    </View>
);

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    label: { marginBottom: 4 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8 },
});

export default LocationTagger;