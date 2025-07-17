import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ItemList from '../components/ItemList';
import UsageHistory from '../components/UsageHistory';
import AddItemModal from '../components/AddItemModal';

const HomeScreen = () => {
    const [activeTab, setActiveTab] = useState('items'); // 'items' or 'history'
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const { colors } = useTheme();

    // Animation values for FAB
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // Animate FAB when modal visibility changes
    useEffect(() => {
        if (isAddModalVisible) {
            // When opening modal, rotate + to x
            Animated.parallel([
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            // When closing modal, rotate x back to +
            Animated.parallel([
                Animated.timing(rotateAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isAddModalVisible]);

    return (
        <>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.headerContainer}>
                    <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.logoIconText, { color: 'white' }]}>BT</Text>
                        <View style={[styles.logoAccent, { backgroundColor: colors.accent }]} />
                    </View>

                    <View style={[styles.tabContainer, { borderColor: colors.cardBorder, flex: 1, marginLeft: 12 }]}>
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                { backgroundColor: colors.card },
                                activeTab === 'items' && { backgroundColor: colors.primary }
                            ]}
                            onPress={() => setActiveTab('items')}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    { color: colors.textSecondary },
                                    activeTab === 'items' && { color: colors.background }
                                ]}
                            >
                                My Items
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                { backgroundColor: colors.card },
                                activeTab === 'history' && { backgroundColor: colors.primary }
                            ]}
                            onPress={() => setActiveTab('history')}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    { color: colors.textSecondary },
                                    activeTab === 'history' && { color: colors.background }
                                ]}
                            >
                                Usage History
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {activeTab === 'items' ? (
                    <>
                        <SearchBar />
                        <CategoryFilter />
                        <ItemList />
                    </>
                ) : (
                    <UsageHistory />
                )}

                {/* Add Item Modal */}
                <AddItemModal
                    visible={isAddModalVisible}
                    onClose={() => setAddModalVisible(false)}
                />
            </View>

            {/* Floating Action Button - Only shown when modal is closed */}
            {!isAddModalVisible && (
                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: colors.primary }]}
                    onPress={() => setAddModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.fabIcon}>+</Text>
                </TouchableOpacity>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 8
    },
    logoIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    logoIconText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    logoAccent: {
        position: 'absolute',
        width: 12,
        height: 3,
        bottom: 8,
        borderRadius: 1.5,
    },
    // Keep these for backward compatibility
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginTop: 10,
        marginBottom: 4
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    logoTextAccent: {
        fontSize: 32,
        fontWeight: 'bold',
        marginLeft: 4
    },
    tagline: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24
    },
    tabContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        height: 40 // Match the height of the logo icon
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabText: {
        fontWeight: '600',
        fontSize: 15
    },
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        right: 20,
        bottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1100 // Higher than the modal's zIndex
    },
    fabIcon: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold'
    }
});

export default HomeScreen;