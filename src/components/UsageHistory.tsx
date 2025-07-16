import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useItems } from '../context/ItemContext';
import { useTheme } from '../theme/ThemeProvider';

const UsageHistory = () => {
    const { state } = useItems();
    const { colors } = useTheme();

    // Create a flat list of all usage events with item names
    const usageEvents = state.items
        .filter(item => item.usageHistory && item.usageHistory.length > 0)
        .flatMap(item =>
            item.usageHistory!.map(date => ({
                id: `${item.id}-${date.getTime()}`,
                itemName: item.name,
                date: date,
                location: item.location
            }))
        )
        .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by most recent first

    const renderUsageItem = ({ item }) => (
        <View style={[
            styles.usageItem,
            {
                backgroundColor: colors.card,
                borderLeftColor: colors.accent
            }
        ]}>
            <View style={styles.usageHeader}>
                <Text style={[styles.itemName, { color: colors.text }]}>{item.itemName}</Text>
                <Text style={[styles.usageDate, { color: colors.textSecondary }]}>
                    {item.date.toLocaleDateString()}
                </Text>
            </View>
            <Text style={[styles.location, { color: colors.textSecondary }]}>📍 {item.location}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>Usage History</Text>

            {usageEvents.length > 0 ? (
                <FlatList
                    data={usageEvents}
                    renderItem={renderUsageItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                        No usage history yet
                    </Text>
                    <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
                        Tap on an item and select "Mark as Used" to record usage
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        flex: 1
    },
    listContent: {
        paddingBottom: 20
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 16,
        fontSize: 18
    },
    usageItem: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
        borderLeftWidth: 4,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    usageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600'
    },
    usageDate: {
        fontSize: 12
    },
    location: {
        fontSize: 14
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 8
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
        maxWidth: '80%'
    }
});

export default UsageHistory;