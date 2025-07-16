import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const SmartHomeIntegration = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Smart Home Integration</Text>
        <Button title="Connect Device" onPress={() => { }} />
    </View>
);

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    title: { fontWeight: 'bold', marginBottom: 8 },
});

export default SmartHomeIntegration;