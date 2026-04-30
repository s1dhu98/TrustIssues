import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { languageList } from '../utils/translations';

export default function SettingsScreen() {
    const { theme, themeName, changeTheme, themes } = useTheme();
    const { lang, changeLang, t } = useLang();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={[styles.title, { color: theme.text }]}>⚙️ {t('settings')}</Text>
                <View style={[styles.section, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.accent }]}>🌍 {t('language')}</Text>
                    {languageList.map((l) => (
                        <TouchableOpacity key={l.code}
                            style={[styles.option, { borderColor: theme.border }, lang === l.code && { backgroundColor: theme.cardAlt }]}
                            onPress={() => changeLang(l.code)}>
                            <Text style={[styles.optionText, { color: theme.text }]}>{l.flag} {l.name}</Text>
                            {lang === l.code && <Ionicons name="checkmark-circle" size={24} color={theme.accent} />}
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={[styles.section, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.accent }]}>🎨 {t('theme')}</Text>
                    {Object.keys(themes).map((key) => (
                        <TouchableOpacity key={key}
                            style={[styles.option, { borderColor: theme.border }, themeName === key && { backgroundColor: theme.cardAlt }]}
                            onPress={() => changeTheme(key)}>
                            <View style={styles.themeRow}>
                                <View style={[styles.swatch, { backgroundColor: themes[key].accent }]} />
                                <View style={[styles.swatch, { backgroundColor: themes[key].accentAlt }]} />
                                <View style={[styles.swatch, { backgroundColor: themes[key].bg, borderWidth: 1, borderColor: theme.border }]} />
                                <Text style={[styles.optionText, { color: theme.text, marginLeft: 10, textTransform: 'capitalize' }]}>{key}</Text>
                            </View>
                            {themeName === key && <Ionicons name="checkmark-circle" size={24} color={theme.accent} />}
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={[styles.section, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.accent }]}>ℹ️ {t('about')}</Text>
                    <Text style={[styles.aboutText, { color: theme.text }]}>TrustIssues 🚩</Text>
                    <Text style={[styles.aboutSub, { color: theme.textSecondary }]}>{t('version')}</Text>
                    <Text style={[styles.aboutSub, { color: theme.textSecondary, marginTop: 10 }]}>
                        Your food's truth, exposed. Data powered by Open Food Facts.
                    </Text>
                    <Text style={[styles.aboutSub, { color: theme.textSecondary, marginTop: 10, fontStyle: 'italic' }]}>
                        ⚠️ This app provides educational info only. Not medical advice. Consult a doctor for health decisions.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: 16, paddingBottom: 40 },
    title: { fontSize: 28, fontWeight: '900', marginBottom: 16 },
    section: { padding: 18, borderRadius: 20, marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
    option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 14, marginVertical: 4, borderWidth: 1 },
    optionText: { fontSize: 15, fontWeight: '700' },
    themeRow: { flexDirection: 'row', alignItems: 'center' },
    swatch: { width: 20, height: 20, borderRadius: 10, marginRight: -6 },
    aboutText: { fontSize: 22, fontWeight: '900', marginTop: 4 },
    aboutSub: { fontSize: 13, marginTop: 4, lineHeight: 18 },
});