import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, ScrollView, Animated, Alert,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const { theme } = useTheme();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const logoScale = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
            Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 5, useNativeDriver: true }),
        ]).start();
    }, []);

    const validate = () => {
        const errs = {};
        if (!email.trim()) errs.email = 'Email is required';
        else if (!email.includes('@')) errs.email = 'Enter a valid email';
        if (!password) errs.password = 'Password is required';
        else if (password.length < 6) errs.password = 'Min 6 characters';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await login(email, password);
        } catch (e) {
            Alert.alert('Login Failed', e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                    {/* Logo & Branding */}
                    <Animated.View style={[styles.logoSection, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}>
                        <LinearGradient colors={[theme.accent, theme.accentAlt]} style={styles.logoCircle}>
                            <Text style={styles.logoEmoji}>🚩</Text>
                        </LinearGradient>
                        <Text style={[styles.appName, { color: theme.text }]}>TrustIssues</Text>
                        <Text style={[styles.tagline, { color: theme.textSecondary }]}>
                            Don't trust your food. Verify it.
                        </Text>
                    </Animated.View>

                    {/* Form */}
                    <Animated.View style={[styles.formCard, { backgroundColor: theme.card, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <Text style={[styles.formTitle, { color: theme.text }]}>Welcome Back 👋</Text>
                        <Text style={[styles.formSubtitle, { color: theme.textSecondary }]}>Sign in to continue</Text>

                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: theme.cardAlt, borderColor: errors.email ? theme.red : theme.border }]}>
                                <Ionicons name="mail-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="you@example.com"
                                    placeholderTextColor={theme.textSecondary + '88'}
                                    value={email}
                                    onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: null })); }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.email && <Text style={[styles.errorText, { color: theme.red }]}>{errors.email}</Text>}
                        </View>

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Password</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: theme.cardAlt, borderColor: errors.password ? theme.red : theme.border }]}>
                                <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="••••••••"
                                    placeholderTextColor={theme.textSecondary + '88'}
                                    value={password}
                                    onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: null })); }}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={theme.textSecondary} />
                                </TouchableOpacity>
                            </View>
                            {errors.password && <Text style={[styles.errorText, { color: theme.red }]}>{errors.password}</Text>}
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85} style={{ marginTop: 8 }}>
                            <LinearGradient colors={[theme.accent, theme.accentAlt]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.submitBtn}>
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitText}>Sign In</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Footer */}
                    <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                        <Text style={[styles.footerText, { color: theme.textSecondary }]}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={[styles.footerLink, { color: theme.accent }]}>Sign Up</Text>
                        </TouchableOpacity>
                    </Animated.View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 40 },
    logoSection: { alignItems: 'center', marginBottom: 32 },
    logoCircle: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    logoEmoji: { fontSize: 40 },
    appName: { fontSize: 36, fontWeight: '900', letterSpacing: -0.5 },
    tagline: { fontSize: 14, fontWeight: '600', marginTop: 6, textAlign: 'center' },
    formCard: { borderRadius: 28, padding: 24, marginBottom: 24 },
    formTitle: { fontSize: 26, fontWeight: '900' },
    formSubtitle: { fontSize: 14, fontWeight: '600', marginTop: 4, marginBottom: 24 },
    inputGroup: { marginBottom: 18 },
    label: { fontSize: 13, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 2, paddingHorizontal: 14 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 16, fontWeight: '600', paddingVertical: 16 },
    eyeBtn: { padding: 4 },
    errorText: { fontSize: 12, fontWeight: '700', marginTop: 6, marginLeft: 4 },
    submitBtn: { paddingVertical: 18, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    submitText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.3 },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    footerText: { fontSize: 15, fontWeight: '600' },
    footerLink: { fontSize: 15, fontWeight: '800' },
});
