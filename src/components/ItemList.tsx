import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useItems } from '../context/ItemContext';
import { useTheme } from '../theme/ThemeProvider';
import { Item } from '../types';
import ItemDetailModal from './ItemDetailModal';
import SuccessToast from './SuccessToast';

const ItemList = () => {
    const { filteredItems, deleteItem, updateItem } = useItems();
    const { colors } = useTheme();
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleItemPress = (item: Item) => {
        setSelectedItem(item);
        setDetailModalVisible(true);
    };

    const markAsUsed = (item: Item) => {
        const updatedItem = {
            ...item,
            usageHistory: [...(item.usageHistory || []), new Date()]
        };
        updateItem(updatedItem);

        // Show success toast
        setToastMessage(`${item.name} marked as used`);
        setToastVisible(true);
    };

    const handleUpdateItem = (updatedItem: Item) => {
        updateItem(updatedItem);

        // Update the selected item to reflect changes immediately
        setSelectedItem(updatedItem);

        // Show success toast
        setToastMessage(`${updatedItem.name} updated`);
        setToastVisible(true);
    };

    const handleDelete = (id: string) => {
        const itemName = selectedItem?.name || 'Item';
        deleteItem(id);

        // Show success toast
        setToastMessage(`${itemName} deleted`);
        setToastVisible(true);
    };

    const handleCloseModal = () => {
        setDetailModalVisible(false);
    };

    const handleHideToast = () => {
        setToastVisible(false);
    };

    const renderItem = ({ item }: { item: Item }) => (
        <TouchableOpacity
            style={[
                styles.itemContainer,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                    shadowColor: colors.text
                }
            ]}
            onPress={() => handleItemPress(item)}
        >
            <View style={styles.itemHeader}>
                <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.itemDate, { color: colors.textSecondary }]}>
                    {item.createdAt.toLocaleDateString()}
                </Text>
            </View>
            <Text style={[styles.itemLocation, { color: colors.textSecondary }]}>
                📍 {item.location}
            </Text>

            <View style={styles.tagsContainer}>
                {item.category && (
                    <View style={[styles.categoryTag, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[styles.categoryText, { color: colors.primary }]}>
                            {item.category}
                        </Text>
                    </View>
                )}

                {item.usageHistory && item.usageHistory.length > 0 && (
                    <View style={[styles.usageTag, { backgroundColor: colors.accent + '20' }]}>
                        <Text style={[styles.usageCount, { color: colors.accent }]}>
                            Used {item.usageHistory.length} time{item.usageHistory.length !== 1 ? 's' : ''}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    if (filteredItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No items found</Text>
                <Text style={[styles.emptySubtext, { color: colors.textLight }]}>Add your first item above!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>
                Your Items ({filteredItems.length})
            </Text>
            <FlatList
                data={filteredItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />

            {/* Item Detail Modal */}
            <ItemDetailModal
                visible={detailModalVisible}
                onClose={handleCloseModal}
                item={selectedItem}
                onMarkAsUsed={markAsUsed}
                onDelete={handleDelete}
                onUpdate={handleUpdateItem}
            />

            {/* Success Toast */}
            <SuccessToast
                visible={toastVisible}
                message={toastMessage}
                onHide={handleHideToast}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        flex: 1,
    },
    listContent: {
        paddingBottom: 20
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 12,
        fontSize: 18,
    },
    itemContainer: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
    },
    itemDate: {
        fontSize: 12,
    },
    itemLocation: {
        fontSize: 15,
        marginBottom: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    categoryTag: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 4,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
    },
    usageTag: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    usageCount: {
        fontSize: 12,
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        flex: 1
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 20
    },
});

export default ItemList;