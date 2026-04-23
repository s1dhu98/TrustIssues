import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { requestPermissionsAsync } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { fetchProduct, analyzeIngredients } from '../utils/flagAnalyzer';
import { saveScan } from '../utils/storage';
import GradientButton from '../components/GradientButton';

// Conditionally import BarCodeScanner only on native platforms
let BarCodeScanner = null;
if (Platform.OS !== 'web') {
  const { BarCodeScanner: BCS } = require('expo-camera');
  BarCodeScanner = BCS;
}

export default function ScannerScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useLang();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [showManual, setShowManual] = useState(false);
  
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Skip permission request on web since barcode scanning is not supported
      setHasPermission(true);
      return;
    }
    
    (async () => {
      try {
        const { status } = await requestPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        console.log('Permission request failed:', error);
        // For web, assume permission is granted if request fails
        setHasPermission(true);
      }
    })();
  }, []);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => setScanned(false));
    return unsubscribe;
  }, [navigation]);
  
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
      const analysis = analyzeIngredients(product.ingredients);
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
  
  if (hasPermission === null) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.text, textAlign: 'center', marginTop: 100 }}>
          {Platform.OS === 'web' ? 'Loading scanner...' : 'Requesting camera permission...'}
        </Text>
      </SafeAreaView>
    );
  }
  
  if (hasPermission === false && Platform.OS !== 'web') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={styles.centered}>
          <Ionicons name="camera-off" size={80} color={theme.red} />
          <Text style={[styles.permText, { color: theme.text }]}>{t('permissionDenied')}</Text>
          <GradientButton title={t('grantPermission')} onPress={async () => {
            try {
              const { status } = await requestPermissionsAsync();
              setHasPermission(status === 'granted');
            } catch (error) {
              console.log('Permission request failed:', error);
              setHasPermission(true);
            }
          }} style={{ marginTop: 20 }} />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {Platform.OS !== 'web' && BarCodeScanner ? (
        <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: theme.text, fontSize: 18, textAlign: 'center', padding: 20 }}>
            📷 Barcode scanning is not supported on web.{'\n'}Please use the manual entry option below.
          </Text>
        </View>
      )}
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
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={theme.accent} />
            <Text style={styles.loadingText}>{t('loading')}</Text>
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
            <TouchableOpacity style={[styles.manualBtn, { backgroundColor: theme.card }]} onPress={() => setShowManual(true)}>
              <Ionicons name="keypad" size={20} color={theme.accent} />
              <Text style={[styles.manualBtnText, { color: theme.text }]}>{t('enterBarcode')}</Text>
            </TouchableOpacity>
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
  loadingBox: { position: 'absolute', alignSelf: 'center', top: '50%', backgroundColor: 'rgba(0,0,0,0.8)', padding: 30, borderRadius: 20, alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 12, fontWeight: '700' },
  bottomControls: { padding: 16 },
  manualBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 20, gap: 8 },
  manualBtnText: { fontSize: 15, fontWeight: '700' },
  manualBox: { padding: 16, borderRadius: 20 },
  input: { borderWidth: 2, borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12, fontWeight: '600' },
  btnSm: { padding: 14, borderRadius: 12, paddingHorizontal: 20 },
});