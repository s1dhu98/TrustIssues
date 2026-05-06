import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation }) {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <ImageBackground 
                source={require('../../assets/bg_landing.png')} 
                style={styles.bgImage}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    
                    {/* Top Bar */}
                    <View style={styles.topBar}>
                        <View style={styles.logoRow}>
                            <Ionicons name="shield-checkmark" size={24} color={theme.accent} />
                            <Text style={[styles.logoText, { color: theme.accent }]}>TRUST ISSUES</Text>
                        </View>
                        <Ionicons name="search" size={24} color={theme.accent} />
                    </View>

                    {/* Live Banner */}
                    <View style={styles.liveBanner}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>Live: 2.4k Verifications today</Text>
                    </View>

                    {/* Main Title Area */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.mainTitle}>DON'T</Text>
                        <Text style={styles.mainTitle}>TRUST.</Text>
                        <Text style={styles.mainTitleWhite}>VERIFY.</Text>
                    </View>

                    {/* Big Action Button */}
                    <TouchableOpacity 
                        style={[styles.scanBtn, { backgroundColor: theme.accent }]} 
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Scan')}
                    >
                        <Ionicons name="qr-code-outline" size={32} color="#000" />
                        <Text style={styles.scanBtnText}>SCAN{'\n'}NOW</Text>
                    </TouchableOpacity>

                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    bgImage: { flex: 1, width: '100%', height: '100%' },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', padding: 20, justifyContent: 'space-between' },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 20 },
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    logoText: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },
    liveBanner: { alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: '#333', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 10 },
    liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccff00', shadowColor: '#ccff00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8 },
    liveText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    titleContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    mainTitle: { color: '#ccff00', fontSize: 80, fontWeight: '900', lineHeight: 85, letterSpacing: -2, textTransform: 'uppercase' },
    mainTitleWhite: { color: '#fff', fontSize: 80, fontWeight: '900', lineHeight: 85, letterSpacing: -2, textTransform: 'uppercase' },
    scanBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 24, paddingHorizontal: 40, borderRadius: 16, marginBottom: 20, gap: 16 },
    scanBtnText: { color: '#000', fontSize: 28, fontWeight: '900', letterSpacing: 4, textAlign: 'center' }
});