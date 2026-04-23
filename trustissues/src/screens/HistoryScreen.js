import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { getHistory, clearHistory } from '../utils/storage';

export default function HistoryScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useLang();
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    const unsub = navigation.addListener('focus', async () => {
      setHistory(await getHistory());
    });
    return unsub;
  }, [navigation]);
  
  const handleClear = () => {
    Alert.alert(t('clearHistory'), '?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => { await clearHistory(); setHistory([]); } },
    ]);
  };
  
  const getScoreColor = (s) => {
    if (s >= 70) return theme.green;
    if (s >= 40) return theme.white;
    return theme.red;
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>🕐 {t('history')}</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="trash" size={24} color={theme.red} />
          </TouchableOpacity>
        )}
      </View>
      {history.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="scan" size={80} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{t('noHistory')}</Text>
        </View>
      ) : (
        <FlatList data={history} keyExtractor={(item, idx) => item.barcode + idx}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.item, { backgroundColor: theme.card }]}
              onPress={() => navigation.navigate('Result', { product: item })}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.brand, { color: theme.textSecondary }]} numberOfLines={1}>{item.brand}</Text>
                <Text style={[styles.date, { color: theme.textSecondary }]}>{new Date(item.scannedAt).toLocaleDateString()}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: getScoreColor(item.score) }]}>
                <Text style={styles.badgeText}>{item.score}</Text>
              </View>
            </TouchableOpacity>
          )} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 28, fontWeight: '900' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, marginTop: 16, fontWeight: '600' },
  item: { flexDirection: 'row', padding: 16, borderRadius: 18, marginBottom: 10, alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '700' },
  brand: { fontSize: 13, marginTop: 2 },
  date: { fontSize: 11, marginTop: 4 },
  badge: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontWeight: '900', fontSize: 16 },
});