import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useItems } from '../context/ItemContext';
import { Item } from '../types';

const ItemList = () => {
    const { filteredItems, deleteItem, updateItem } = useItems();

    const handleItemPress = (item: Item) => {
        Alert.alert(
            item.name,
            `Location: ${item.location}\nAdded: ${item.createdAt.toLocaleDateString()}`,
            [
                { text: 'Mark as Used', onPress: () => markAsUsed(item) },
                { text: 'Delete', onPress: () => confirmDelete(item.id), style: 'destructive' },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const markAsUsed = (item: Item) => {
        const updatedItem = {
            ...item,
            usageHistory: [...(item.usageHistory || []), new Date()]
        };
        updateItem(updatedItem);
        Alert.alert('Success', 'Item marked as used!');
    };

    const confirmDelete = (id: string) => {
        Alert.alert(
            'Delete Item',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => deleteItem(id), style: 'destructive' }
            ]
        );
    };

    const renderItem = ({ item }: { item: Item }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handleItemPress(item)}>
            <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDate}>{item.createdAt.toLocaleDateString()}</Text>
            </View>
            <Text style={styles.itemLocation}>📍 {item.location}</Text>
            {item.usageHistory && item.usageHistory.length > 0 && (
                <Text style={styles.usageCount}>
                    Used {item.usageHistory.length} time{item.usageHistory.length !== 1 ? 's' : ''}
                </Text>
            )}
        </TouchableOpacity>
    );

    if (filteredItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No items found</Text>
                <Text style={styles.emptySubtext}>Add your first item above!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Items ({filteredItems.length})</Text>
            <FlatList
                data={filteredItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 16,
    },
    itemContainer: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    itemDate: {
        fontSize: 12,
        color: '#666',
    },
    itemLocation: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    usageCount: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
    },
});

export default ItemList;