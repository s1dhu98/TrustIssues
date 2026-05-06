import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getHistory } from '../utils/storage';

export default function DashboardScreen({ navigation }) {
    const { theme } = useTheme();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setHistory(await getHistory());
        });
        return unsubscribe;
    }, [navigation]);

    const calculateTrustScore = () => {
        if (history.length === 0) return 0;
        const totalScore = history.reduce((acc, item) => acc + (item.score || 0), 0);
        return Math.round(totalScore / history.length);
    };

    const trustScore = calculateTrustScore();
    const verifiedItems = history.filter(h => h.score >= 70).length;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                
                <Text style={styles.title}>Your</Text>
                <Text style={styles.title}>Dashboard</Text>
                <Text style={styles.subtitle}>
                    Real-time analysis of your consumption habits. Transparency is not a feature, it's the baseline.
                </Text>

                <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
                    <Text style={styles.chartTitle}>PERSONAL TRUST SCORE</Text>
                    <View style={[styles.circleWrap, { borderColor: theme.accent }]}>
                        <Text style={styles.circleNumber}>{trustScore}</Text>
                        <Text style={[styles.circleLabel, { color: theme.accent }]}>
                            {trustScore >= 80 ? 'EXCELLENT' : trustScore >= 50 ? 'AVERAGE' : 'POOR'}
                        </Text>
                    </View>
                    <Text style={styles.chartFooter}>
                        Based on your last {history.length || 30} scanned items and preferred verified vendors.
                    </Text>
                </View>

                <View style={[styles.chartCard, { backgroundColor: '#141113' }]}>
                    <Text style={styles.chartTitle}>VERIFIED SAFE PRODUCTS</Text>
                    <View style={[styles.circleWrap, { borderColor: '#ffb6c1' }]}>
                        <Text style={styles.circleNumber}>{verifiedItems}</Text>
                        <Text style={[styles.circleLabel, { color: '#ffb6c1' }]}>ITEMS</Text>
                    </View>
                    <Text style={styles.chartFooter}>
                        Products matching your strict no-additive dietary profile.
                    </Text>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Verified Favorites</Text>
                    <Text style={[styles.viewAll, { color: theme.accent }]}>VIEW ALL</Text>
                </View>

                {history.slice(0, 3).map((item, idx) => (
                    <TouchableOpacity key={idx} style={[styles.historyCard, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('Result', { product: item })}>
                        <View style={styles.historyImgPlaceholder}>
                            <Ionicons name="image-outline" size={24} color="#666" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.historyName}>{item.name}</Text>
                            <Text style={styles.historyBrand}>{item.brand || 'Independently lab tested'}</Text>
                        </View>
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="shield-checkmark" size={12} color="#ccff00" />
                            <Text style={styles.verifiedText}>VERIFIED</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                <View style={[styles.joinCard, { backgroundColor: '#111' }]}>
                    <Text style={styles.joinSuper}>GLOBAL NETWORK</Text>
                    <Text style={styles.joinTitle}>Join the</Text>
                    <Text style={styles.joinTitle}>Movement</Text>
                    <Text style={styles.joinSub}>
                        Contribute your scan data to the global ledger. Help us map the truth behind the industrial food complex.
                    </Text>
                    <TouchableOpacity style={[styles.joinBtn, { backgroundColor: theme.accent }]}>
                        <Ionicons name="earth" size={16} color="#000" />
                        <Text style={styles.joinBtnText}>CONNECT NOW</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: 20, paddingBottom: 60 },
    title: { color: '#fff', fontSize: 36, fontWeight: '900', letterSpacing: -1 },
    subtitle: { color: '#888', fontSize: 14, lineHeight: 22, marginTop: 12, marginBottom: 30 },
    chartCard: { padding: 24, borderRadius: 0, borderWidth: 1, borderColor: '#333', alignItems: 'center', marginBottom: 20 },
    chartTitle: { color: '#ccc', fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 24 },
    circleWrap: { width: 160, height: 160, borderRadius: 80, borderWidth: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    circleNumber: { color: '#fff', fontSize: 48, fontWeight: '900', letterSpacing: -2 },
    circleLabel: { fontSize: 12, fontWeight: '900', letterSpacing: 2 },
    chartFooter: { color: '#888', fontSize: 12, textAlign: 'center', lineHeight: 18, paddingHorizontal: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10, marginBottom: 16 },
    sectionTitle: { color: '#fff', fontSize: 24, fontWeight: '900' },
    viewAll: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
    historyCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 0, borderWidth: 1, borderColor: '#333', marginBottom: 12 },
    historyImgPlaceholder: { width: 50, height: 50, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    historyName: { color: '#fff', fontSize: 16, fontWeight: '900', marginBottom: 4 },
    historyBrand: { color: '#888', fontSize: 12 },
    verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#ccff00', backgroundColor: 'rgba(204,255,0,0.1)' },
    verifiedText: { color: '#ccff00', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    joinCard: { padding: 24, borderRadius: 0, borderWidth: 1, borderColor: '#333', marginTop: 24 },
    joinSuper: { color: '#ff0055', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 12 },
    joinTitle: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
    joinSub: { color: '#ccc', fontSize: 13, lineHeight: 20, marginTop: 16, marginBottom: 24 },
    joinBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8 },
    joinBtnText: { color: '#000', fontSize: 14, fontWeight: '900', letterSpacing: 2 }
});
