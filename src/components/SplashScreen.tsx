import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const { colors } = useTheme();
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.8);

    useEffect(() => {
        // Animation sequence
        Animated.sequence([
            // Fade in and scale up
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]),
            // Hold for a moment
            Animated.delay(1000),
            // Fade out
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Call onFinish when animation completes
            onFinish();
        });
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <View style={styles.logoContainer}>
                    <Text style={[styles.logoText, { color: colors.primary }]}>Bin</Text>
                    <Text style={[styles.logoTextAccent, { color: colors.accent }]}>There</Text>
                </View>
                <Text style={[styles.tagline, { color: colors.textSecondary }]}>
                    Find what you need, when you need it
                </Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    logoText: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    logoTextAccent: {
        fontSize: 48,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    tagline: {
        fontSize: 16,
        marginTop: 8,
    },
});

export default SplashScreen;