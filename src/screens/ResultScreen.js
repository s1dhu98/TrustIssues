import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import FlagCard from '../components/FlagCard';
import GradientButton from '../components/GradientButton';
import { analyzeIngredients } from '../utils/flagAnalyzer';

export default function ResultScreen({ route, navigation }) {
    const { product } = route.params;
    const { theme } = useTheme();
    const { t } = useLang();
    
    // Dynamically analyze to ensure flags are always present
    const analysis = analyzeIngredients(product.ingredients);
    const reds = product.reds || analysis.reds || [];
    const greens = product.greens || analysis.greens || [];
    const whites = product.whites || analysis.whites || [];

    const getScoreColor = (s) => {
        if (s >= 70) return theme.green;
        if (s >= 40) return theme.white;
        return theme.red;
    };

    const getScoreLabel = (s) => {
        if (s >= 70) return t('good') + ' 💚';
        if (s >= 40) return t('neutral') + ' ⚪';
        return t('bad') + ' 🚩';
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.topTitle, { color: theme.text }]}>Analysis</Text>
                <View style={{ width: 28 }} />
            </View>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={[styles.productCard, { backgroundColor: theme.card }]}>
                    {product.image ? (
                        <Image source={{ uri: product.image }} style={styles.image} />
                    ) : (
                        <View style={[styles.imagePlaceholder, { backgroundColor: theme.cardAlt }]}>
                            <Ionicons name="image" size={60} color={theme.textSecondary} />
                        </View>
                    )}
                    <Text style={[styles.productName, { color: theme.text }]}>{product.name}</Text>
                    <Text style={[styles.productBrand, { color: theme.textSecondary }]}>{product.brand}</Text>
                </View>
                <LinearGradient colors={[getScoreColor(product.score), getScoreColor(product.score) + '99']} style={styles.scoreCard}>
                    <Text style={styles.scoreLabel}>{t('healthScore')}</Text>
                    <Text style={styles.scoreNum}>{product.score}/100</Text>
                    <Text style={styles.scoreVerdict}>{getScoreLabel(product.score)}</Text>
                </LinearGradient>
                <FlagCard type="red" title={t('redFlags')} items={reds} />
                <FlagCard type="green" title={t('greenFlags')} items={greens} />
                <FlagCard type="white" title={t('whiteFlags')} items={whites} />
                {product.ingredients ? (
                    <View style={[styles.ingCard, { backgroundColor: theme.card }]}>
                        <Text style={[styles.ingTitle, { color: theme.text }]}>📝 {t('ingredients')}</Text>
                        <Text style={[styles.ingText, { color: theme.textSecondary }]}>{product.ingredients}</Text>
                    </View>
                ) : null}
                {product.nutriscore ? (
                    <View style={[styles.ingCard, { backgroundColor: theme.card }]}>
                        <Text style={[styles.ingTitle, { color: theme.text }]}>🏷️ Nutri-Score: {product.nutriscore.toUpperCase()}</Text>
                        {product.nova ? (
                            <Text style={[styles.ingText, { color: theme.textSecondary }]}>
                                NOVA Group: {product.nova} {product.nova >= 4 ? '(Ultra-processed ⚠️)' : product.nova === 1 ? '(Unprocessed ✅)' : ''}
                            </Text>
                        ) : null}
                    </View>
                ) : null}
                <GradientButton title={t('scanAgain')} icon="📷" onPress={() => navigation.navigate('Main', { screen: 'Scan' })} style={{ marginTop: 16 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    topTitle: { fontSize: 20, fontWeight: '800' },
    scroll: { padding: 16, paddingBottom: 40 },
    productCard: { borderRadius: 24, padding: 20, alignItems: 'center', marginBottom: 16 },
    image: { width: 140, height: 140, borderRadius: 20, marginBottom: 12 },
    imagePlaceholder: { width: 140, height: 140, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    productName: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
    productBrand: { fontSize: 14, marginTop: 4 },
    scoreCard: { padding: 24, borderRadius: 24, alignItems: 'center', marginBottom: 8 },
    scoreLabel: { color: '#fff', fontSize: 14, fontWeight: '700', opacity: 0.9 },
    scoreNum: { color: '#fff', fontSize: 52, fontWeight: '900', marginVertical: 4 },
    scoreVerdict: { color: '#fff', fontSize: 18, fontWeight: '800' },
    ingCard: { padding: 18, borderRadius: 20, marginTop: 12 },
    ingTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
    ingText: { fontSize: 13, lineHeight: 20 },
});