import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { getHistory } from '../utils/storage';
import GradientButton from '../components/GradientButton';

export default function HomeScreen({ navigation }) {
    const { theme } = useTheme();
    const { t } = useLang();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setHistory(await getHistory());
        });
        return unsubscribe;
    }, [navigation]);

    const tips = [t('tip1'), t('tip2'), t('tip3')];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <View style={[styles.hero, { borderColor: theme.accent }]}>
                    <Text style={styles.welcomeText}>{t('welcome')}</Text>
                    <Text style={[styles.appName, { color: theme.accent }]}>TrustIssues 🚩</Text>
                    <Text style={styles.heroSubtitle}>{t('subtitle')}</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCircleCard}>
                        <View style={[styles.statCircle, { borderColor: theme.accent }]}>
                            <Text style={[styles.statNumber, { color: theme.text }]}>{history.length}</Text>
                        </View>
                        <Text style={[styles.statLabel, { color: theme.accent }]}>{t('scans')}</Text>
                    </View>
                    <View style={styles.statCircleCard}>
                        <View style={[styles.statCircle, { borderColor: theme.green }]}>
                            <Text style={[styles.statNumber, { color: theme.text }]}>
                                {history.filter(h => h.score >= 70).length}
                            </Text>
                        </View>
                        <Text style={[styles.statLabel, { color: theme.green }]}>{t('good')}</Text>
                    </View>
                    <View style={styles.statCircleCard}>
                        <View style={[styles.statCircle, { borderColor: theme.red }]}>
                            <Text style={[styles.statNumber, { color: theme.text }]}>
                                {history.filter(h => h.score < 40).length}
                            </Text>
                        </View>
                        <Text style={[styles.statLabel, { color: theme.red }]}>{t('bad')}</Text>
                    </View>
                </View>

                <GradientButton title={t('scanNow')} icon="📷" onPress={() => navigation.navigate('Scan')} style={{ marginVertical: 16 }} />

                <View style={[styles.tipCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.tipLabel, { color: theme.accent }]}>💡 {t('quickTip')}</Text>
                    <Text style={[styles.tipText, { color: theme.text }]}>{randomTip}</Text>
                </View>

                {history.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('recentScans')}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('History')}>
                                <Text style={[styles.viewAll, { color: theme.accent }]}>{t('viewAll')} →</Text>
                            </TouchableOpacity>
                        </View>
                        {history.slice(0, 3).map((item, idx) => (
                            <TouchableOpacity key={idx} style={[styles.historyItem, { backgroundColor: theme.card }]}
                                onPress={() => navigation.navigate('Result', { product: item })}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.historyName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                                    <Text style={[styles.historyBrand, { color: theme.textSecondary }]}>{item.brand}</Text>
                                </View>
                                <View style={[styles.scoreBadge, { backgroundColor: item.score >= 70 ? theme.green : item.score >= 40 ? theme.white : theme.red }]}>
                                    <Text style={styles.scoreText}>{item.score}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TouchableOpacity style={[styles.learnCard, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('Learn')}>
                    <Ionicons name="book" size={32} color={theme.accent} />
                    <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={[styles.learnTitle, { color: theme.text }]}>{t('explainTitle')}</Text>
                        <Text style={[styles.learnSub, { color: theme.textSecondary }]}>{t('learnMore')} →</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: 16, paddingBottom: 40 },
    hero: { borderRadius: 0, padding: 28, marginBottom: 16, backgroundColor: '#0a0a0a', borderWidth: 1, borderColor: '#333' },
    welcomeText: { color: '#ccc', fontSize: 14, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
    appName: { color: '#ccff00', fontSize: 40, fontWeight: '900', marginVertical: 8, letterSpacing: -1, textTransform: 'uppercase' },
    heroSubtitle: { color: '#888', fontSize: 12, lineHeight: 18, fontFamily: 'monospace' },
    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16, justifyContent: 'space-around', paddingVertical: 10 },
    statCircleCard: { alignItems: 'center' },
    statCircle: { width: 90, height: 90, borderRadius: 45, borderWidth: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 8, backgroundColor: '#0a0a0a' },
    statNumber: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
    statLabel: { fontSize: 10, marginTop: 8, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
    tipCard: { padding: 18, borderRadius: 0, marginVertical: 8, borderWidth: 1, borderColor: '#222' },
    tipLabel: { fontSize: 12, fontWeight: '900', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    tipText: { fontSize: 13, fontWeight: '600', lineHeight: 22, fontFamily: 'monospace' },
    section: { marginTop: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
    sectionTitle: { fontSize: 20, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
    viewAll: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
    historyItem: { flexDirection: 'row', padding: 16, borderRadius: 0, marginBottom: 8, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
    historyName: { fontSize: 15, fontWeight: '900', textTransform: 'uppercase' },
    historyBrand: { fontSize: 11, marginTop: 4, fontFamily: 'monospace', textTransform: 'uppercase' },
    scoreBadge: { width: 44, height: 44, borderRadius: 0, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
    scoreText: { color: '#000', fontWeight: '900', fontSize: 16 },
    learnCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 0, marginTop: 16, borderWidth: 1, borderColor: '#222' },
    learnTitle: { fontSize: 16, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
    learnSub: { fontSize: 12, marginTop: 4, fontFamily: 'monospace', textTransform: 'uppercase' },
});