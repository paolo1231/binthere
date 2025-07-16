import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface SuccessToastProps {
    message: string;
    visible: boolean;
    onHide: () => void;
}

const { width } = Dimensions.get('window');

const SuccessToast: React.FC<SuccessToastProps> = ({ message, visible, onHide }) => {
    const { colors } = useTheme();
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Show toast
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Hide toast after 2 seconds
            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(translateY, {
                        toValue: -100,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    onHide();
                });
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: colors.secondary,
                    transform: [{ translateY }],
                    opacity,
                },
            ]}
        >
            <View style={styles.content}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.message}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: width / 2 - 150,
        width: 300,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1000,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkmark: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    message: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default SuccessToast;