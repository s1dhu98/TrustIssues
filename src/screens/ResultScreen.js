import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import FlagCard from '../components/FlagCard';
import GradientButton from '../components/GradientButton';
import { analyzeIngredients } from '../utils/flagAnalyzer';
import { fetchIngredientDetails } from '../utils/usdaApi';

export default function ResultScreen({ route, navigation }) {
    const { product } = route.params;
    const { theme } = useTheme();
    const { t } = useLang();
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [ingredientDetails, setIngredientDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    
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

    const handleIngredientPress = async (item) => {
        setSelectedIngredient(item);
        setLoadingDetails(true);
        setIngredientDetails(null);
        const details = await fetchIngredientDetails(item.name);
        setIngredientDetails(details);
        setLoadingDetails(false);
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
                <FlagCard type="red" title={t('redFlags')} items={reds} onPressItem={handleIngredientPress} />
                <FlagCard type="green" title={t('greenFlags')} items={greens} onPressItem={handleIngredientPress} />
                <FlagCard type="white" title={t('whiteFlags')} items={whites} onPressItem={handleIngredientPress} />
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

            {/* Ingredient Details Modal */}
            <Modal visible={selectedIngredient !== null} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.bg }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>
                                {selectedIngredient?.name.toUpperCase()}
                            </Text>
                            <TouchableOpacity onPress={() => setSelectedIngredient(null)}>
                                <Ionicons name="close-circle" size={32} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={[styles.ingCard, { backgroundColor: theme.card, marginTop: 0 }]}>
                                <Text style={[styles.ingTitle, { color: theme.text }]}>TrustIssues Flag 🚩</Text>
                                <Text style={[styles.ingText, { color: theme.textSecondary }]}>{selectedIngredient?.reason}</Text>
                            </View>

                            <View style={{ marginTop: 16 }}>
                                <Text style={[styles.ingTitle, { color: theme.text }]}>USDA Database 📚</Text>
                                {loadingDetails ? (
                                    <View style={{ padding: 20, alignItems: 'center' }}>
                                        <ActivityIndicator size="large" color={theme.accent} />
                                        <Text style={{ color: theme.textSecondary, marginTop: 10 }}>Fetching data from USDA...</Text>
                                    </View>
                                ) : ingredientDetails ? (
                                    <View style={[styles.ingCard, { backgroundColor: theme.card }]}>
                                        <Text style={[styles.ingText, { color: theme.text, fontWeight: '700', marginBottom: 8 }]}>
                                            {ingredientDetails.description}
                                        </Text>
                                        <Text style={{ color: theme.textSecondary, marginBottom: 16, fontSize: 13 }}>
                                            Category: {ingredientDetails.category}
                                        </Text>
                                        
                                        <Text style={[styles.ingTitle, { color: theme.text, fontSize: 14 }]}>Nutritional Profile:</Text>
                                        {ingredientDetails.nutrients.length > 0 ? (
                                            ingredientDetails.nutrients.map((n, idx) => (
                                                <View key={idx} style={styles.nutrientRow}>
                                                    <Text style={{ color: theme.textSecondary, fontSize: 13 }}>{n.name}</Text>
                                                    <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13 }}>{n.value} {n.unit}</Text>
                                                </View>
                                            ))
                                        ) : (
                                            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>No nutrient data available.</Text>
                                        )}
                                    </View>
                                ) : (
                                    <View style={[styles.ingCard, { backgroundColor: theme.card }]}>
                                        <Text style={[styles.ingText, { color: theme.textSecondary, fontStyle: 'italic' }]}>
                                            No extended nutritional data found in the USDA database for "{selectedIngredient?.name}".
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
    topTitle: { fontSize: 20, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2 },
    scroll: { padding: 16, paddingBottom: 40 },
    productCard: { borderRadius: 0, padding: 20, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#333' },
    image: { width: 140, height: 140, borderRadius: 0, marginBottom: 12, borderWidth: 1, borderColor: '#444' },
    imagePlaceholder: { width: 140, height: 140, borderRadius: 0, justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#333' },
    productName: { fontSize: 22, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
    productBrand: { fontSize: 14, marginTop: 4, textTransform: 'uppercase', letterSpacing: 2 },
    scoreCard: { padding: 24, borderRadius: 0, alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#444' },
    scoreLabel: { color: '#000', fontSize: 14, fontWeight: '900', opacity: 0.9, textTransform: 'uppercase', letterSpacing: 2 },
    scoreNum: { color: '#000', fontSize: 52, fontWeight: '900', marginVertical: 4 },
    scoreVerdict: { color: '#000', fontSize: 18, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
    ingCard: { padding: 18, borderRadius: 0, marginTop: 12, borderWidth: 1, borderColor: '#333' },
    ingTitle: { fontSize: 16, fontWeight: '900', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    ingText: { fontSize: 13, lineHeight: 20, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 0, borderTopRightRadius: 0, padding: 24, maxHeight: '80%', borderWidth: 1, borderColor: '#444', borderBottomWidth: 0 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 22, fontWeight: '900', flex: 1, marginRight: 16, letterSpacing: 1 },
    nutrientRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#222' }
});