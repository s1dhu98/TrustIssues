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
        <LinearGradient colors={[theme.accent, theme.accentAlt]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Text style={styles.welcomeText}>{t('welcome')}</Text>
          <Text style={styles.appName}>TrustIssues 🚩</Text>
          <Text style={styles.heroSubtitle}>{t('subtitle')}</Text>
        </LinearGradient>
        
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.statNumber, { color: theme.accent }]}>{history.length}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('scans')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.statNumber, { color: theme.green }]}>
              {history.filter(h => h.score >= 70).length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('good')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.statNumber, { color: theme.red }]}>
              {history.filter(h => h.score < 40).length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('bad')}</Text>
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
  hero: { borderRadius: 30, padding: 28, marginBottom: 16 },
  welcomeText: { color: '#fff', fontSize: 16, fontWeight: '600', opacity: 0.9 },
  appName: { color: '#fff', fontSize: 36, fontWeight: '900', marginVertical: 4 },
  heroSubtitle: { color: '#fff', fontSize: 14, opacity: 0.95 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  statCard: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: '900' },
  statLabel: { fontSize: 12, marginTop: 4, fontWeight: '600' },
  tipCard: { padding: 18, borderRadius: 20, marginVertical: 8 },
  tipLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  tipText: { fontSize: 15, fontWeight: '600', lineHeight: 22 },
  section: { marginTop: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  viewAll: { fontSize: 14, fontWeight: '700' },
  historyItem: { flexDirection: 'row', padding: 16, borderRadius: 16, marginBottom: 8, alignItems: 'center' },
  historyName: { fontSize: 15, fontWeight: '700' },
  historyBrand: { fontSize: 12, marginTop: 2 },
  scoreBadge: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  scoreText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  learnCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, marginTop: 16 },
  learnTitle: { fontSize: 16, fontWeight: '800' },
  learnSub: { fontSize: 13, marginTop: 4 },
});