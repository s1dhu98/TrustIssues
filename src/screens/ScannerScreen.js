import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { fetchProduct, analyzeIngredients } from '../utils/flagAnalyzer';
import { saveScan } from '../utils/storage';
import { performOCR } from '../utils/ocr';
import GradientButton from '../components/GradientButton';

export default function ScannerScreen({ navigation }) {
    const { theme } = useTheme();
    const { t, lang } = useLang();
    const { user } = require('../context/AuthContext').useAuth();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [manualBarcode, setManualBarcode] = useState('');
    const [showManual, setShowManual] = useState(false);

    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => setScanned(false));
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        if (loading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.3, duration: 800, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
                ])
            ).start();
        } else {
            pulseAnim.stopAnimation();
        }
    }, [loading]);

    const handleBarCodeScanned = async ({ data }) => {
        if (scanned || loading) return;
        setScanned(true);
        setLoading(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await processBarcode(data);
    };

    const processBarcode = async (barcode) => {
        try {
            const product = await fetchProduct(barcode);
            if (!product) {
                Alert.alert(t('productNotFound'), barcode, [
                    { text: t('tryAgain'), onPress: () => { setScanned(false); setLoading(false); } }
                ]);
                return;
            }

            if (!product.ingredients || product.ingredients.trim() === '') {
                setLoading(false);
                Alert.alert(
                    'No Ingredients Found',
                    'We found the product, but the ingredients list is missing from the database. Would you like to scan the ingredients label directly?',
                    [
                        { text: 'Cancel', style: 'cancel', onPress: () => setScanned(false) },
                        { text: 'Scan Label', onPress: () => handleOCRScan(product) }
                    ]
                );
                return;
            }
            const analysis = await analyzeIngredients(product.ingredients, user?.allergies || [], lang);
            const fullProduct = { ...product, ...analysis };
            await saveScan(fullProduct);
            setLoading(false);
            setScanned(false);
            navigation.navigate('Result', { product: fullProduct });
        } catch (e) {
            setLoading(false);
            setScanned(false);
            Alert.alert('Error', 'Failed to fetch product data');
        }
    };

    const handleOCRScan = async (baseProduct = null) => {
        setScanned(true);
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Camera permission is required to scan ingredients.');
                setScanned(false);
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 0.6,
            });

            if (result.canceled) {
                setScanned(false);
                return;
            }

            setLoading(true);
            const text = await performOCR(result.assets[0].uri);
            
            if (!text || text.trim().length < 5) {
                setLoading(false);
                Alert.alert('Scan Failed', 'Could not extract text from the image. Please try again with better lighting.', [
                    { text: 'OK', onPress: () => setScanned(false) }
                ]);
                return;
            }

            const analysis = await analyzeIngredients(text, user?.allergies || [], lang);
            const fullProduct = {
                barcode: baseProduct ? baseProduct.barcode : 'OCR_' + Date.now(),
                name: baseProduct ? baseProduct.name : 'Scanned Ingredients',
                brand: baseProduct ? baseProduct.brand : 'Unknown',
                image: baseProduct && baseProduct.image ? baseProduct.image : result.assets[0].uri,
                ingredients: text,
                ...analysis
            };

            await saveScan(fullProduct);
            setLoading(false);
            setScanned(false);
            navigation.navigate('Result', { product: fullProduct });

        } catch (e) {
            setLoading(false);
            setScanned(false);
            Alert.alert('Error', 'Something went wrong during label scanning.');
        }
    };

    const handleManualSubmit = () => {
        if (manualBarcode.length >= 8) {
            setLoading(true);
            processBarcode(manualBarcode);
            setManualBarcode('');
            setShowManual(false);
        } else {
            Alert.alert('Invalid', 'Barcode must be at least 8 digits');
        }
    };

    if (!permission) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
                <Text style={{ color: theme.text, textAlign: 'center', marginTop: 100 }}>
                    Requesting camera permission...
                </Text>
            </SafeAreaView>
        );
    }

    if (permission && !permission.granted) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
                <View style={styles.centered}>
                    <Ionicons name="camera-off" size={80} color={theme.red} />
                    <Text style={[styles.permText, { color: theme.text }]}>{t('permissionDenied')}</Text>
                    <GradientButton title={t('grantPermission')} onPress={requestPermission} style={{ marginTop: 20 }} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
            <CameraView 
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} 
                barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr"] }}
                style={StyleSheet.absoluteFillObject} 
            />
            <SafeAreaView style={styles.overlay}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{t('scanFood')} 📷</Text>
                    <Text style={styles.headerSub}>{t('scanInstructions')}</Text>
                </View>
                <View style={styles.scanArea}>
                    <View style={[styles.corner, styles.topLeft, { borderColor: theme.accent }]} />
                    <View style={[styles.corner, styles.topRight, { borderColor: theme.accent }]} />
                    <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.accent }]} />
                    <View style={[styles.corner, styles.bottomRight, { borderColor: theme.accent }]} />
                </View>
                {loading && (
                    <View style={[StyleSheet.absoluteFill, styles.fullScreenLoading]}>
                        <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }], borderColor: theme.accent, backgroundColor: theme.accent + '20' }]}>
                            <Ionicons name="sparkles" size={50} color={theme.accent} />
                        </Animated.View>
                        <Text style={[styles.loadingTitle, { color: theme.accent }]}>Consulting AI...</Text>
                        <Text style={styles.loadingSubtitle}>Analyzing health flags & your allergies</Text>
                    </View>
                )}
                <View style={styles.bottomControls}>
                    {showManual ? (
                        <View style={[styles.manualBox, { backgroundColor: theme.card }]}>
                            <TextInput style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                placeholder="1234567890123" placeholderTextColor={theme.textSecondary}
                                value={manualBarcode} onChangeText={setManualBarcode} keyboardType="number-pad" maxLength={14} />
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <TouchableOpacity style={[styles.btnSm, { backgroundColor: theme.cardAlt }]} onPress={() => setShowManual(false)}>
                                    <Text style={{ color: theme.text, fontWeight: '700' }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnSm, { backgroundColor: theme.accent, flex: 1 }]} onPress={handleManualSubmit}>
                                    <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>{t('submit')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity style={[styles.manualBtn, { backgroundColor: theme.card, flex: 1 }]} onPress={() => setShowManual(true)}>
                                <Ionicons name="keypad" size={20} color={theme.accent} />
                                <Text style={[styles.manualBtnText, { color: theme.text }]}>{t('enterBarcode')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.manualBtn, { backgroundColor: theme.card, flex: 1 }]} onPress={() => handleOCRScan()}>
                                <Ionicons name="document-text" size={20} color={theme.accent} />
                                <Text style={[styles.manualBtnText, { color: theme.text }]}>Scan Label</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    overlay: { flex: 1, justifyContent: 'space-between' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    permText: { fontSize: 18, fontWeight: '700', marginTop: 20, textAlign: 'center' },
    header: { padding: 20, backgroundColor: 'rgba(0,0,0,0.5)', margin: 16, borderRadius: 20 },
    headerText: { color: '#fff', fontSize: 22, fontWeight: '800' },
    headerSub: { color: '#fff', opacity: 0.9, marginTop: 4 },
    scanArea: { width: 280, height: 280, alignSelf: 'center', position: 'relative' },
    corner: { position: 'absolute', width: 40, height: 40, borderWidth: 5 },
    topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 12 },
    topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 12 },
    bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 12 },
    bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 12 },
    fullScreenLoading: { backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
    pulseCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    loadingTitle: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 8 },
    loadingSubtitle: { color: '#ddd', fontSize: 16, fontWeight: '600', textAlign: 'center', paddingHorizontal: 40 },
    bottomControls: { padding: 16 },
    manualBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 20, gap: 8 },
    manualBtnText: { fontSize: 15, fontWeight: '700' },
    manualBox: { padding: 16, borderRadius: 20 },
    input: { borderWidth: 2, borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12, fontWeight: '600' },
    btnSm: { padding: 14, borderRadius: 12, paddingHorizontal: 20 },
});