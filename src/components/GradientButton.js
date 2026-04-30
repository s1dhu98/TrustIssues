import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

export default function GradientButton({ onPress, title, icon, style }) {
    const { theme } = useTheme();

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={style}>
            <LinearGradient
                colors={[theme.accent, theme.accentAlt]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
            >
                <Text style={styles.text}>{icon} {title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 20, alignItems: 'center' },
    text: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 0.5 },
});