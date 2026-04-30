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

export default function SignupScreen({ navigation }) {
    const { theme } = useTheme();
    const { signup } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const logoScale = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
            Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 5, useNativeDriver: true }),
        ]).start();
    }, []);

    const validate = () => {
        const errs = {};
        if (!name.trim()) errs.name = 'Name is required';
        if (!email.trim()) errs.email = 'Email is required';
        else if (!email.includes('@')) errs.email = 'Enter a valid email';
        if (!password) errs.password = 'Password is required';
        else if (password.length < 6) errs.password = 'Min 6 characters';
        if (password !== confirmPassword) errs.confirmPassword = 'Passwords don\'t match';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSignup = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await signup(name, email, password);
        } catch (e) {
            Alert.alert('Signup Failed', e.message);
        } finally {
            setLoading(false);
        }
    };

    const clearError = (field) => setErrors((e) => ({ ...e, [field]: null }));

    return (
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                    {/* Header */}
                    <Animated.View style={[styles.logoSection, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}>
                        <LinearGradient colors={[theme.accent, theme.accentAlt]} style={styles.logoCircle}>
                            <Text style={styles.logoEmoji}>🔍</Text>
                        </LinearGradient>
                        <Text style={[styles.appName, { color: theme.text }]}>Join TrustIssues</Text>
                        <Text style={[styles.tagline, { color: theme.textSecondary }]}>
                            Start verifying what you eat today
                        </Text>
                    </Animated.View>

                    {/* Form */}
                    <Animated.View style={[styles.formCard, { backgroundColor: theme.card, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <Text style={[styles.formTitle, { color: theme.text }]}>Create Account ✨</Text>
                        <Text style={[styles.formSubtitle, { color: theme.textSecondary }]}>Fill in your details to get started</Text>

                        {/* Name */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Full Name</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: theme.cardAlt, borderColor: errors.name ? theme.red : theme.border }]}>
                                <Ionicons name="person-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="John Doe"
                                    placeholderTextColor={theme.textSecondary + '88'}
                                    value={name}
                                    onChangeText={(t) => { setName(t); clearError('name'); }}
                                    autoCapitalize="words"
                                />
                            </View>
                            {errors.name && <Text style={[styles.errorText, { color: theme.red }]}>{errors.name}</Text>}
                        </View>

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
                                    onChangeText={(t) => { setEmail(t); clearError('email'); }}
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
                                    placeholder="Min 6 characters"
                                    placeholderTextColor={theme.textSecondary + '88'}
                                    value={password}
                                    onChangeText={(t) => { setPassword(t); clearError('password'); }}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={theme.textSecondary} />
                                </TouchableOpacity>
                            </View>
                            {errors.password && <Text style={[styles.errorText, { color: theme.red }]}>{errors.password}</Text>}
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Confirm Password</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: theme.cardAlt, borderColor: errors.confirmPassword ? theme.red : theme.border }]}>
                                <Ionicons name="shield-checkmark-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="Re-enter password"
                                    placeholderTextColor={theme.textSecondary + '88'}
                                    value={confirmPassword}
                                    onChangeText={(t) => { setConfirmPassword(t); clearError('confirmPassword'); }}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                            </View>
                            {errors.confirmPassword && <Text style={[styles.errorText, { color: theme.red }]}>{errors.confirmPassword}</Text>}
                        </View>

                        {/* Password Strength Indicator */}
                        {password.length > 0 && (
                            <View style={styles.strengthSection}>
                                <View style={[styles.strengthBar, { backgroundColor: theme.cardAlt }]}>
                                    <View style={[
                                        styles.strengthFill,
                                        {
                                            width: password.length < 6 ? '33%' : password.length < 10 ? '66%' : '100%',
                                            backgroundColor: password.length < 6 ? theme.red : password.length < 10 ? '#f59e0b' : theme.green,
                                        }
                                    ]} />
                                </View>
                                <Text style={[styles.strengthLabel, {
                                    color: password.length < 6 ? theme.red : password.length < 10 ? '#f59e0b' : theme.green
                                }]}>
                                    {password.length < 6 ? '🔴 Weak' : password.length < 10 ? '🟡 Medium' : '🟢 Strong'}
                                </Text>
                            </View>
                        )}

                        {/* Signup Button */}
                        <TouchableOpacity onPress={handleSignup} disabled={loading} activeOpacity={0.85} style={{ marginTop: 8 }}>
                            <LinearGradient colors={[theme.accent, theme.accentAlt]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.submitBtn}>
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitText}>Create Account</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Footer */}
                    <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                        <Text style={[styles.footerText, { color: theme.textSecondary }]}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={[styles.footerLink, { color: theme.accent }]}>Sign In</Text>
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
    logoSection: { alignItems: 'center', marginBottom: 24 },
    logoCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    logoEmoji: { fontSize: 36 },
    appName: { fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
    tagline: { fontSize: 14, fontWeight: '600', marginTop: 6, textAlign: 'center' },
    formCard: { borderRadius: 28, padding: 24, marginBottom: 24 },
    formTitle: { fontSize: 24, fontWeight: '900' },
    formSubtitle: { fontSize: 14, fontWeight: '600', marginTop: 4, marginBottom: 20 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 12, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 2, paddingHorizontal: 14 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 15, fontWeight: '600', paddingVertical: 14 },
    eyeBtn: { padding: 4 },
    errorText: { fontSize: 12, fontWeight: '700', marginTop: 5, marginLeft: 4 },
    strengthSection: { marginBottom: 8 },
    strengthBar: { height: 6, borderRadius: 3, marginBottom: 6, overflow: 'hidden' },
    strengthFill: { height: '100%', borderRadius: 3 },
    strengthLabel: { fontSize: 12, fontWeight: '700' },
    submitBtn: { paddingVertical: 18, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    submitText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.3 },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    footerText: { fontSize: 15, fontWeight: '600' },
    footerLink: { fontSize: 15, fontWeight: '800' },
});
