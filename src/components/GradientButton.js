import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
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
            <View style={[styles.button, { backgroundColor: theme.accent, borderWidth: 1, borderColor: theme.accentAlt }]}>
                <Text style={[styles.text, { color: '#000' }]}>{icon} {title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 0, alignItems: 'center' },
    text: { fontWeight: '900', fontSize: 16, letterSpacing: 2, textTransform: 'uppercase' },
});