import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReminderList = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Reminders</Text>
        {/* Placeholder for reminders */}
        <Text>No reminders yet.</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    title: { fontWeight: 'bold', marginBottom: 8 },
});

export default ReminderList;