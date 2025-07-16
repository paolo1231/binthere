import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UsageHistory = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Usage History</Text>
        {/* Placeholder for usage history */}
        <Text>No usage history yet.</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    title: { fontWeight: 'bold', marginBottom: 8 },
});

export default UsageHistory;