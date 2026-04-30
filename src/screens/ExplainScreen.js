import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';

export default function ExplainScreen() {
    const { theme } = useTheme();
    const { t } = useLang();

    const sections = [
        {
            emoji: '🟢', color: theme.green, title: t('greenFlags'), desc: t('greenDesc'),
            examples: ['🥦 Vegetables & Fruits', '🌾 Whole grains (oats, brown rice)', '🥜 Nuts & seeds', '🐟 Fish, lean protein', '🍯 Natural honey', '🌿 Herbs & spices'],
            simple: 'THINK: Food your grandma would recognize. Things that grow from the ground or come from animals without being changed in a factory.',
        },
        {
            emoji: '🚩', color: theme.red, title: t('redFlags'), desc: t('redDesc'),
            examples: ['🍬 High fructose corn syrup', '🎨 Artificial colors (Red 40, Yellow 5)', '🧪 Aspartame, Saccharin', '🥓 Sodium nitrite (in processed meat)', '🛢️ Hydrogenated oils (trans fats)', '⚗️ BHA, BHT preservatives'],
            simple: "THINK: If you can't say the word, or it sounds like science class, your body probably doesn't want it. These can make you sick over time.",
        },
        {
            emoji: '⚪', color: theme.white, title: t('whiteFlags'), desc: t('whiteDesc'),
            examples: ['🧂 Salt (needed but not too much)', '🍚 Regular sugar', '🧊 Citric acid (usually safe)', '🌽 Modified starch', '🥄 Natural flavors (vague)', '🍬 Stevia, sucralose'],
            simple: "THINK: Not great, not awful. Like a messy friend - okay sometimes, but don't live with them. Eat these once in a while, not every day.",
        },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <LinearGradient colors={[theme.accent, theme.accentAlt]} style={styles.header}>
                    <Text style={styles.headerTitle}>📚 {t('explainTitle')}</Text>
                    <Text style={styles.headerSub}>Simple truth. No confusion.</Text>
                </LinearGradient>
                {sections.map((s, idx) => (
                    <View key={idx} style={[styles.card, { backgroundColor: theme.card, borderColor: s.color }]}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.emoji}>{s.emoji}</Text>
                            <Text style={[styles.cardTitle, { color: s.color }]}>{s.title}</Text>
                        </View>
                        <Text style={[styles.cardDesc, { color: theme.text }]}>{s.desc}</Text>
                        <View style={[styles.simpleBox, { backgroundColor: theme.cardAlt }]}>
                            <Text style={[styles.simpleLabel, { color: s.color }]}>💡 SIMPLY PUT:</Text>
                            <Text style={[styles.simpleText, { color: theme.text }]}>{s.simple}</Text>
                        </View>
                        <Text style={[styles.examplesTitle, { color: theme.textSecondary }]}>Examples:</Text>
                        {s.examples.map((ex, i) => (
                            <Text key={i} style={[styles.example, { color: theme.text }]}>{ex}</Text>
                        ))}
                    </View>
                ))}
                <View style={[styles.ruleCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.ruleTitle, { color: theme.accent }]}>🎯 Golden Rules</Text>
                    <Text style={[styles.ruleItem, { color: theme.text }]}>1️⃣ If the ingredient list is longer than 5 things, be careful.</Text>
                    <Text style={[styles.ruleItem, { color: theme.text }]}>2️⃣ If you can't pronounce it, your body can't process it well.</Text>
                    <Text style={[styles.ruleItem, { color: theme.text }]}>3️⃣ Real food usually doesn't need a barcode. 🍎🥕</Text>
                    <Text style={[styles.ruleItem, { color: theme.text }]}>4️⃣ "Sugar-free" often means fake sugar. Not always better.</Text>
                    <Text style={[styles.ruleItem, { color: theme.text }]}>5️⃣ Sugar hides under 50+ names (dextrose, maltose, syrup...).</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: 16, paddingBottom: 40 },
    header: { borderRadius: 24, padding: 24, marginBottom: 16 },
    headerTitle: { color: '#fff', fontSize: 26, fontWeight: '900' },
    headerSub: { color: '#fff', fontSize: 14, marginTop: 6, opacity: 0.95 },
    card: { borderRadius: 22, padding: 20, marginBottom: 16, borderLeftWidth: 6 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    emoji: { fontSize: 32 },
    cardTitle: { fontSize: 24, fontWeight: '900', marginLeft: 10 },
    cardDesc: { fontSize: 15, lineHeight: 22, marginBottom: 14, fontWeight: '600' },
    simpleBox: { padding: 14, borderRadius: 14, marginBottom: 14 },
    simpleLabel: { fontSize: 12, fontWeight: '900', marginBottom: 6, letterSpacing: 1 },
    simpleText: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
    examplesTitle: { fontSize: 12, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase' },
    example: { fontSize: 14, marginVertical: 3, fontWeight: '600' },
    ruleCard: { borderRadius: 22, padding: 20, marginTop: 8 },
    ruleTitle: { fontSize: 18, fontWeight: '900', marginBottom: 12 },
    ruleItem: { fontSize: 14, marginVertical: 6, lineHeight: 20, fontWeight: '600' },
});