import React, { useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
    Dimensions,
    TouchableOpacity,
    Text,
    PanResponder,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import ItemEntry from './ItemEntry';

interface AddItemModalProps {
    visible: boolean;
    onClose: () => void;
}

const { height } = Dimensions.get('window');

const AddItemModal: React.FC<AddItemModalProps> = ({ visible, onClose }) => {
    const { colors } = useTheme();
    const slideAnim = useRef(new Animated.Value(height)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    // Create pan responder for swipe-to-close gesture
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only respond to vertical gestures
                return Math.abs(gestureState.dy) > Math.abs(gestureState.dx * 3);
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    // Only allow downward swipes
                    slideAnim.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100 || gestureState.vy > 0.5) {
                    // If swiped down far enough or with enough velocity, close the modal
                    Animated.timing(slideAnim, {
                        toValue: height,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => onClose());
                } else {
                    // Otherwise, snap back to open position
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 0,
                    }).start();
                }
            },
        })
    ).current;

    // Handle animations when visibility changes
    useEffect(() => {
        if (visible) {
            // Reset position before animating in
            slideAnim.setValue(height);
            backdropOpacity.setValue(0);

            // Animate in
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0.5,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Animate out
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: height,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleBackdropPress = () => {
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View style={styles.modalContainer}>
                <TouchableWithoutFeedback onPress={handleBackdropPress}>
                    <Animated.View
                        style={[
                            styles.backdrop,
                            {
                                backgroundColor: 'black',
                                opacity: backdropOpacity,
                            },
                        ]}
                    />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            transform: [{ translateY: slideAnim }],
                            backgroundColor: colors.background,
                        },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.handle} />
                    <View style={styles.header}>
                        <Text style={[styles.headerText, { color: colors.text }]}>Add New Item</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={{ fontSize: 22, color: colors.textSecondary }}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ flex: 1 }}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <ItemEntry onItemAdded={onClose} />
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Animated.View>

                {/* Modal FAB - mimics the main FAB */}
                <TouchableOpacity
                    style={[styles.modalFab, { backgroundColor: colors.primary }]}
                    onPress={onClose}
                    activeOpacity={0.8}
                >
                    <Text style={styles.fabIcon}>✕</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        position: 'relative',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    fabCutout: {
        position: 'absolute',
        width: 80,
        height: 80,
        bottom: 0,
        right: 0,
        backgroundColor: 'transparent',
    },
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80%', // Take up 80% of the screen height
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
        elevation: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    handle: {
        alignSelf: 'center',
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#ccc',
        marginTop: 10,
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    modalFab: {
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
        zIndex: 1100,
    },
    fabIcon: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default AddItemModal;