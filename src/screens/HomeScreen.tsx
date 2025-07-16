import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ItemEntry from '../components/ItemEntry';
import LocationTagger from '../components/LocationTagger';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import ReminderList from '../components/ReminderList';
import UsageHistory from '../components/UsageHistory';
import SmartHomeIntegration from '../components/SmartHomeIntegration';

const HomeScreen = () => (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Iteminder</Text>
        <ItemEntry />
        <LocationTagger />
        <SearchBar />
        <FilterPanel />
        <ReminderList />
        <UsageHistory />
        <SmartHomeIntegration />
    </ScrollView>
);

const styles = StyleSheet.create({
    container: { padding: 16 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});

export default HomeScreen;