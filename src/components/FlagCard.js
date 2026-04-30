import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function FlagCard({ type, items, title, onPressItem }) {
    const { theme } = useTheme();
    const colors = { green: theme.green, red: theme.red, white: theme.white };
    const emojis = { green: '🟢', red: '🚩', white: '⚪' };

    return (
        <View style={[styles.card, { backgroundColor: theme.card, borderLeftColor: colors[type] }]}>
            <Text style={[styles.title, { color: theme.text }]}>
                {emojis[type]} {title} ({items.length})
            </Text>
            {items.length === 0 ? (
                <Text style={[styles.empty, { color: theme.textSecondary }]}>None detected</Text>
            ) : (
                items.map((item, idx) => (
                    <TouchableOpacity key={idx} style={styles.item} onPress={() => onPressItem && onPressItem(item)}>
                        <Text style={[styles.itemName, { color: colors[type] }]}>• {item.name.toUpperCase()}</Text>
                        <Text style={[styles.itemReason, { color: theme.textSecondary }]}>{item.reason}</Text>
                    </TouchableOpacity>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 20, padding: 18, marginVertical: 8, borderLeftWidth: 6 },
    title: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
    empty: { fontStyle: 'italic', fontSize: 14 },
    item: { marginBottom: 10 },
    itemName: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
    itemReason: { fontSize: 13, lineHeight: 18 },
});