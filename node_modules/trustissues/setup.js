const fs = require('fs');
const path = require('path');

const files = {
  'package.json': `{
  "name": "trustissues",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "expo-barcode-scanner": "~13.0.1",
    "expo-camera": "~15.0.0",
    "expo-haptics": "~13.0.1",
    "expo-linear-gradient": "~13.0.2",
    "react": "18.2.0",
    "react-native": "0.74.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "react-native-screens": "~3.31.1",
    "react-native-safe-area-context": "4.10.1",
    "@react-native-async-storage/async-storage": "1.23.1",
    "react-native-gesture-handler": "~2.16.1",
    "@expo/vector-icons": "^14.0.0"
  }
}`,

  'app.json': `{
  "expo": {
    "name": "TrustIssues",
    "slug": "trustissues",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "splash": {
      "backgroundColor": "#0F0F23",
      "resizeMode": "contain"
    },
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "TrustIssues needs camera access to scan barcodes on food products."
      }
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#0F0F23"
      },
      "permissions": ["CAMERA"]
    },
    "plugins": [
      [
        "expo-barcode-scanner",
        {
          "cameraPermission": "Allow TrustIssues to access camera to scan barcodes."
        }
      ]
    ]
  }
}`,

  'babel.config.js': `module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};`,

  'App.js': `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import ResultScreen from './src/screens/ResultScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ExplainScreen from './src/screens/ExplainScreen';
import HistoryScreen from './src/screens/HistoryScreen';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: 'transparent',
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Scan') iconName = 'scan-circle';
          else if (route.name === 'Learn') iconName = 'book';
          else if (route.name === 'History') iconName = 'time';
          else if (route.name === 'Settings') iconName = 'settings';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScannerScreen} />
      <Tab.Screen name="Learn" component={ExplainScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <RootNavigator />
          </NavigationContainer>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}`,

  'src/context/ThemeContext.js': `import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const themes = {
  dark: {
    name: 'dark', bg: '#0F0F23', card: '#1A1A2E', cardAlt: '#252542',
    text: '#FFFFFF', textSecondary: '#9CA3AF', accent: '#A78BFA', accentAlt: '#F472B6',
    green: '#10B981', red: '#EF4444', white: '#F3F4F6', border: '#2D2D4A',
  },
  light: {
    name: 'light', bg: '#FAFAFA', card: '#FFFFFF', cardAlt: '#F3F4F6',
    text: '#111827', textSecondary: '#6B7280', accent: '#7C3AED', accentAlt: '#EC4899',
    green: '#059669', red: '#DC2626', white: '#E5E7EB', border: '#E5E7EB',
  },
  neon: {
    name: 'neon', bg: '#000000', card: '#0A0A0A', cardAlt: '#1A1A1A',
    text: '#00FF88', textSecondary: '#00CC6A', accent: '#FF00FF', accentAlt: '#00FFFF',
    green: '#00FF88', red: '#FF0066', white: '#FFFFFF', border: '#1F1F1F',
  },
  sunset: {
    name: 'sunset', bg: '#1A0F1F', card: '#2D1B2E', cardAlt: '#3D2940',
    text: '#FFF5E1', textSecondary: '#E0A8C0', accent: '#FF6B9D', accentAlt: '#FFA07A',
    green: '#95E1D3', red: '#F38181', white: '#FCE38A', border: '#4A2F4D',
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState('dark');

  useEffect(() => {
    AsyncStorage.getItem('theme').then((val) => {
      if (val && themes[val]) setThemeName(val);
    });
  }, []);

  const changeTheme = async (name) => {
    setThemeName(name);
    await AsyncStorage.setItem('theme', name);
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[themeName], themeName, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);`,

  'src/context/LanguageContext.js': `import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    AsyncStorage.getItem('lang').then((val) => {
      if (val) setLang(val);
    });
  }, []);

  const changeLang = async (l) => {
    setLang(l);
    await AsyncStorage.setItem('lang', l);
  };

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);`,

  'src/utils/translations.js': `export const translations = {
  en: {
    appName: 'TrustIssues', tagline: "Don't trust your food. Verify it.",
    scanNow: 'Scan Now', greenFlags: 'Green Flags', redFlags: 'Red Flags', whiteFlags: 'White Flags',
    learnMore: 'Learn More', settings: 'Settings', language: 'Language', theme: 'Theme',
    history: 'History', noHistory: 'No scans yet. Start scanning!', scanFood: 'Scan Food',
    scanInstructions: 'Point your camera at a barcode', product: 'Product', ingredients: 'Ingredients',
    healthScore: 'Health Score', scanAgain: 'Scan Again', productNotFound: 'Product not found in database',
    tryAgain: 'Try Again', good: 'Good', bad: 'Bad', neutral: 'Neutral',
    explainTitle: 'Food Flags Explained',
    greenDesc: 'Green flags mean the food is GOOD for you. Natural stuff, vitamins, fiber, real food!',
    redDesc: 'Red flags mean DANGER. Harmful chemicals, too much sugar, bad fats, fake stuff.',
    whiteDesc: 'White flags mean NEUTRAL. Not great, not terrible. Eat in moderation.',
    clearHistory: 'Clear History', about: 'About', version: 'Version 1.0.0', scans: 'scans',
    loading: 'Analyzing...', enterBarcode: 'Or Enter Barcode Manually', submit: 'Submit',
    permissionDenied: 'Camera permission denied', grantPermission: 'Grant Permission',
    welcome: 'Welcome to', subtitle: "Your food's truth, exposed.",
    recentScans: 'Recent Scans', viewAll: 'View All', quickTip: 'Quick Tip',
    tip1: 'Fewer ingredients usually means healthier food!',
    tip2: "If you can't pronounce it, you probably shouldn't eat it.",
    tip3: 'Sugar hides under 50+ different names.',
  },
  es: {
    appName: 'TrustIssues', tagline: 'No confíes en tu comida. Verifícala.',
    scanNow: 'Escanear', greenFlags: 'Banderas Verdes', redFlags: 'Banderas Rojas', whiteFlags: 'Banderas Blancas',
    learnMore: 'Aprende Más', settings: 'Ajustes', language: 'Idioma', theme: 'Tema',
    history: 'Historial', noHistory: '¡Sin escaneos aún!', scanFood: 'Escanear Comida',
    scanInstructions: 'Apunta al código de barras', product: 'Producto', ingredients: 'Ingredientes',
    healthScore: 'Puntuación', scanAgain: 'Escanear Otra Vez', productNotFound: 'Producto no encontrado',
    tryAgain: 'Intentar de Nuevo', good: 'Bueno', bad: 'Malo', neutral: 'Neutral',
    explainTitle: 'Banderas Explicadas',
    greenDesc: 'Verde = BUENO. Natural, vitaminas, fibra, comida real.',
    redDesc: 'Rojo = PELIGRO. Químicos, mucho azúcar, grasas malas.',
    whiteDesc: 'Blanco = NEUTRAL. Ni bueno ni malo. Con moderación.',
    clearHistory: 'Borrar Historial', about: 'Acerca de', version: 'Versión 1.0.0', scans: 'escaneos',
    loading: 'Analizando...', enterBarcode: 'Ingresa Código', submit: 'Enviar',
    permissionDenied: 'Permiso denegado', grantPermission: 'Dar Permiso',
    welcome: 'Bienvenido a', subtitle: 'La verdad de tu comida.',
    recentScans: 'Escaneos Recientes', viewAll: 'Ver Todo', quickTip: 'Consejo',
    tip1: '¡Menos ingredientes = más saludable!',
    tip2: 'Si no lo puedes pronunciar, no lo comas.',
    tip3: 'El azúcar tiene 50+ nombres.',
  },
  hi: {
    appName: 'TrustIssues', tagline: 'अपने खाने पर भरोसा मत करो। जांचो।',
    scanNow: 'स्कैन करें', greenFlags: 'हरी झंडी', redFlags: 'लाल झंडी', whiteFlags: 'सफेद झंडी',
    learnMore: 'और जानें', settings: 'सेटिंग्स', language: 'भाषा', theme: 'थीम',
    history: 'इतिहास', noHistory: 'अभी तक कोई स्कैन नहीं!', scanFood: 'खाना स्कैन करें',
    scanInstructions: 'बारकोड पर कैमरा रखें', product: 'उत्पाद', ingredients: 'सामग्री',
    healthScore: 'स्वास्थ्य स्कोर', scanAgain: 'फिर स्कैन करें', productNotFound: 'उत्पाद नहीं मिला',
    tryAgain: 'फिर कोशिश करें', good: 'अच्छा', bad: 'बुरा', neutral: 'तटस्थ',
    explainTitle: 'झंडियां समझाई गई',
    greenDesc: 'हरा = अच्छा। प्राकृतिक, विटामिन, असली खाना।',
    redDesc: 'लाल = खतरा। केमिकल, ज्यादा चीनी, बुरी चर्बी।',
    whiteDesc: 'सफेद = तटस्थ। थोड़ा ही खाओ।',
    clearHistory: 'इतिहास साफ करें', about: 'बारे में', version: 'संस्करण 1.0.0', scans: 'स्कैन',
    loading: 'विश्लेषण...', enterBarcode: 'बारकोड डालें', submit: 'जमा करें',
    permissionDenied: 'अनुमति नहीं', grantPermission: 'अनुमति दें',
    welcome: 'स्वागत है', subtitle: 'आपके खाने का सच।',
    recentScans: 'हाल के स्कैन', viewAll: 'सब देखें', quickTip: 'टिप',
    tip1: 'कम सामग्री = ज्यादा स्वस्थ!',
    tip2: 'अगर उच्चार नहीं कर सकते, तो मत खाओ।',
    tip3: 'चीनी के 50+ नाम हैं।',
  },
  fr: {
    appName: 'TrustIssues', tagline: 'Ne faites pas confiance à votre nourriture.',
    scanNow: 'Scanner', greenFlags: 'Drapeaux Verts', redFlags: 'Drapeaux Rouges', whiteFlags: 'Drapeaux Blancs',
    learnMore: 'En Savoir Plus', settings: 'Paramètres', language: 'Langue', theme: 'Thème',
    history: 'Historique', noHistory: 'Aucun scan!', scanFood: 'Scanner',
    scanInstructions: 'Pointez le code-barres', product: 'Produit', ingredients: 'Ingrédients',
    healthScore: 'Score Santé', scanAgain: 'Re-scanner', productNotFound: 'Produit introuvable',
    tryAgain: 'Réessayer', good: 'Bon', bad: 'Mauvais', neutral: 'Neutre',
    explainTitle: 'Drapeaux Expliqués',
    greenDesc: 'Vert = BON. Naturel, vitamines, vraie nourriture.',
    redDesc: 'Rouge = DANGER. Chimiques, sucre, mauvaises graisses.',
    whiteDesc: 'Blanc = NEUTRE. Avec modération.',
    clearHistory: 'Effacer', about: 'À propos', version: 'Version 1.0.0', scans: 'scans',
    loading: 'Analyse...', enterBarcode: 'Entrer code', submit: 'Soumettre',
    permissionDenied: 'Permission refusée', grantPermission: 'Autoriser',
    welcome: 'Bienvenue', subtitle: 'La vérité de votre nourriture.',
    recentScans: 'Scans Récents', viewAll: 'Voir Tout', quickTip: 'Astuce',
    tip1: "Moins d'ingrédients = plus sain!",
    tip2: 'Si imprononçable, ne le mangez pas.',
    tip3: 'Le sucre a 50+ noms.',
  },
};

export const languageList = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];`,

  'src/utils/flagAnalyzer.js': `const RED_FLAG_INGREDIENTS = {
  'aspartame': 'Artificial sweetener linked to headaches and possible health risks',
  'saccharin': 'Artificial sweetener, possible carcinogen concerns',
  'acesulfame k': 'Artificial sweetener, long-term effects unclear',
  'acesulfame potassium': 'Artificial sweetener, long-term effects unclear',
  'partially hydrogenated': 'Trans fat - increases heart disease risk',
  'hydrogenated oil': 'Often contains trans fats - bad for heart',
  'red 40': 'Artificial color, linked to hyperactivity in children',
  'red 3': 'Artificial color, banned in cosmetics for safety',
  'yellow 5': 'Artificial color, may cause allergic reactions',
  'yellow 6': 'Artificial color, hyperactivity concerns',
  'blue 1': 'Artificial color with allergy concerns',
  'blue 2': 'Artificial color, behavioral concerns',
  'tartrazine': 'Artificial yellow dye, allergy risks',
  'sodium nitrite': 'Preservative in processed meats, cancer risk',
  'sodium nitrate': 'Preservative, linked to cancer risk',
  'bha': 'Preservative, possible carcinogen',
  'bht': 'Preservative, possible health concerns',
  'tbhq': 'Preservative, linked to vision issues',
  'potassium bromate': 'Flour treatment, banned in many countries',
  'high fructose corn syrup': 'Linked to obesity, diabetes, fatty liver',
  'corn syrup solids': 'Highly processed sugar',
  'monosodium glutamate': 'May cause headaches in sensitive people',
  'carrageenan': 'Thickener, digestive issues concerns',
  'propyl gallate': 'Preservative, endocrine concerns',
  'sodium benzoate': 'Preservative, may form benzene',
  'palm oil': 'High saturated fat, environmental concerns',
  'shortening': 'Often contains trans fats',
};

const GREEN_FLAG_INGREDIENTS = {
  'whole grain': 'Whole grains - rich in fiber and nutrients',
  'whole wheat': 'Whole grain - better than refined',
  'oats': 'Rich in fiber, lowers cholesterol',
  'quinoa': 'Complete protein, rich in nutrients',
  'brown rice': 'Whole grain with fiber',
  'olive oil': 'Heart-healthy monounsaturated fats',
  'avocado': 'Healthy fats, fiber, potassium',
  'flaxseed': 'Omega-3 fatty acids, fiber',
  'chia seed': 'Omega-3, fiber, protein',
  'almonds': 'Healthy fats, vitamin E, protein',
  'walnuts': 'Omega-3 fatty acids',
  'legumes': 'Plant protein and fiber',
  'lentils': 'High protein, fiber, iron',
  'beans': 'Protein, fiber, minerals',
  'chickpeas': 'Protein, fiber, folate',
  'spinach': 'Iron, vitamins, antioxidants',
  'broccoli': 'Vitamins, fiber, antioxidants',
  'blueberries': 'Antioxidants, vitamins',
  'tomato': 'Lycopene, vitamin C',
  'probiotic': 'Good bacteria for gut health',
  'live cultures': 'Probiotics for digestion',
  'honey': 'Natural sweetener with antioxidants',
  'maple syrup': 'Natural sweetener with minerals',
  'turmeric': 'Anti-inflammatory properties',
  'ginger': 'Digestive and anti-inflammatory',
  'cinnamon': 'Antioxidants, blood sugar support',
  'garlic': 'Immune support, antioxidants',
  'fiber': 'Good for digestion and heart health',
  'inulin': 'Prebiotic fiber for gut health',
  'vitamin d': 'Essential for bones and immunity',
  'vitamin b12': 'Essential for nerves and blood',
  'iron': 'Essential mineral',
  'calcium': 'Essential for bones',
  'omega-3': 'Heart and brain health',
};

const WHITE_FLAG_INGREDIENTS = {
  'salt': 'Needed but too much is bad',
  'sodium': 'Watch the amount',
  'sugar': 'Natural but limit intake',
  'cane sugar': 'Less processed but still sugar',
  'natural flavor': 'Vague term, usually fine',
  'citric acid': 'Common preservative, generally safe',
  'ascorbic acid': 'Vitamin C, used as preservative',
  'lecithin': 'Emulsifier, generally safe',
  'xanthan gum': 'Thickener, generally safe',
  'guar gum': 'Thickener, generally safe',
  'pectin': 'Natural thickener from fruit',
  'yeast extract': 'Flavor enhancer, moderate amounts fine',
  'modified starch': 'Processed but generally safe',
  'maltodextrin': 'Processed carb, moderate use',
  'dextrose': 'Simple sugar',
  'glucose': 'Simple sugar',
  'stevia': 'Natural sweetener, mostly safe',
  'sucralose': 'Artificial sweetener, moderation',
};

export function analyzeIngredients(ingredientsText) {
  if (!ingredientsText) return { greens: [], reds: [], whites: [], score: 50 };
  
  const text = ingredientsText.toLowerCase();
  const greens = [], reds = [], whites = [];
  
  Object.entries(RED_FLAG_INGREDIENTS).forEach(([key, reason]) => {
    if (text.includes(key)) reds.push({ name: key, reason });
  });
  Object.entries(GREEN_FLAG_INGREDIENTS).forEach(([key, reason]) => {
    if (text.includes(key)) greens.push({ name: key, reason });
  });
  Object.entries(WHITE_FLAG_INGREDIENTS).forEach(([key, reason]) => {
    if (text.includes(key)) whites.push({ name: key, reason });
  });
  
  let score = 50;
  score += greens.length * 8;
  score -= reds.length * 12;
  score -= whites.length * 2;
  score = Math.max(0, Math.min(100, score));
  
  return { greens, reds, whites, score };
}

export async function fetchProduct(barcode) {
  try {
    const response = await fetch(\`https://world.openfoodfacts.org/api/v2/product/\${barcode}.json\`);
    const data = await response.json();
    if (data.status === 0 || !data.product) return null;
    
    const p = data.product;
    return {
      barcode,
      name: p.product_name || p.product_name_en || 'Unknown Product',
      brand: p.brands || 'Unknown Brand',
      image: p.image_url || p.image_front_url,
      ingredients: p.ingredients_text || p.ingredients_text_en || '',
      nutriments: p.nutriments || {},
      nutriscore: p.nutriscore_grade,
      nova: p.nova_group,
      categories: p.categories,
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}`,

  'src/utils/storage.js': `import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'scan_history';

export async function saveScan(product) {
  try {
    const existing = await getHistory();
    const newEntry = { ...product, scannedAt: Date.now() };
    const updated = [newEntry, ...existing.filter(p => p.barcode !== product.barcode)].slice(0, 50);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) { console.error(e); }
}

export async function getHistory() {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export async function clearHistory() {
  await AsyncStorage.removeItem(HISTORY_KEY);
}`,

  'src/components/GradientButton.js': `import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

export default function GradientButton({ onPress, title, icon, style }) {
  const { theme } = useTheme();
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };
  
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={style}>
      <LinearGradient
        colors={[theme.accent, theme.accentAlt]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={styles.text}>{icon} {title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 20, alignItems: 'center' },
  text: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 0.5 },
});`,

  'src/components/FlagCard.js': `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function FlagCard({ type, items, title }) {
  const { theme } = useTheme();
  const colors = { green: theme.green, red: theme.red, white: theme.white };
  const emojis = { green: '🟢', red: '🚩', white: '⚪' };
  
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderLeftColor: colors[type] }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        {emojis[type]} {title} ({items.length})
      </Text>
      {items.length === 0 ? (
        <Text style={[styles.empty, { color: theme.textSecondary }]}>None detected</Text>
      ) : (
        items.map((item, idx) => (
          <View key={idx} style={styles.item}>
            <Text style={[styles.itemName, { color: colors[type] }]}>• {item.name.toUpperCase()}</Text>
            <Text style={[styles.itemReason, { color: theme.textSecondary }]}>{item.reason}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 18, marginVertical: 8, borderLeftWidth: 6 },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  empty: { fontStyle: 'italic', fontSize: 14 },
  item: { marginBottom: 10 },
  itemName: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  itemReason: { fontSize: 13, lineHeight: 18 },
});`,

  'src/screens/HomeScreen.js': `import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { getHistory } from '../utils/storage';
import GradientButton from '../components/GradientButton';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useLang();
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setHistory(await getHistory());
    });
    return unsubscribe;
  }, [navigation]);
  
  const tips = [t('tip1'), t('tip2'), t('tip3')];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient colors={[theme.accent, theme.accentAlt]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Text style={styles.welcomeText}>{t('welcome')}</Text>
          <Text style={styles.appName}>TrustIssues 🚩</Text>
          <Text style={styles.heroSubtitle}>{t('subtitle')}</Text>
        </LinearGradient>
        
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.statNumber, { color: theme.accent }]}>{history.length}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('scans')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.statNumber, { color: theme.green }]}>
              {history.filter(h => h.score >= 70).length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('good')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.statNumber, { color: theme.red }]}>
              {history.filter(h => h.score < 40).length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('bad')}</Text>
          </View>
        </View>
        
        <GradientButton title={t('scanNow')} icon="📷" onPress={() => navigation.navigate('Scan')} style={{ marginVertical: 16 }} />
        
        <View style={[styles.tipCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.tipLabel, { color: theme.accent }]}>💡 {t('quickTip')}</Text>
          <Text style={[styles.tipText, { color: theme.text }]}>{randomTip}</Text>
        </View>
        
        {history.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('recentScans')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <Text style={[styles.viewAll, { color: theme.accent }]}>{t('viewAll')} →</Text>
              </TouchableOpacity>
            </View>
            {history.slice(0, 3).map((item, idx) => (
              <TouchableOpacity key={idx} style={[styles.historyItem, { backgroundColor: theme.card }]}
                onPress={() => navigation.navigate('Result', { product: item })}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.historyName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                  <Text style={[styles.historyBrand, { color: theme.textSecondary }]}>{item.brand}</Text>
                </View>
                <View style={[styles.scoreBadge, { backgroundColor: item.score >= 70 ? theme.green : item.score >= 40 ? theme.white : theme.red }]}>
                  <Text style={styles.scoreText}>{item.score}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <TouchableOpacity style={[styles.learnCard, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('Learn')}>
          <Ionicons name="book" size={32} color={theme.accent} />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={[styles.learnTitle, { color: theme.text }]}>{t('explainTitle')}</Text>
            <Text style={[styles.learnSub, { color: theme.textSecondary }]}>{t('learnMore')} →</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  hero: { borderRadius: 30, padding: 28, marginBottom: 16 },
  welcomeText: { color: '#fff', fontSize: 16, fontWeight: '600', opacity: 0.9 },
  appName: { color: '#fff', fontSize: 36, fontWeight: '900', marginVertical: 4 },
  heroSubtitle: { color: '#fff', fontSize: 14, opacity: 0.95 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  statCard: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: '900' },
  statLabel: { fontSize: 12, marginTop: 4, fontWeight: '600' },
  tipCard: { padding: 18, borderRadius: 20, marginVertical: 8 },
  tipLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  tipText: { fontSize: 15, fontWeight: '600', lineHeight: 22 },
  section: { marginTop: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  viewAll: { fontSize: 14, fontWeight: '700' },
  historyItem: { flexDirection: 'row', padding: 16, borderRadius: 16, marginBottom: 8, alignItems: 'center' },
  historyName: { fontSize: 15, fontWeight: '700' },
  historyBrand: { fontSize: 12, marginTop: 2 },
  scoreBadge: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  scoreText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  learnCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, marginTop: 16 },
  learnTitle: { fontSize: 16, fontWeight: '800' },
  learnSub: { fontSize: 13, marginTop: 4 },
});`,

  'src/screens/ScannerScreen.js': `import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { fetchProduct, analyzeIngredients } from '../utils/flagAnalyzer';
import { saveScan } from '../utils/storage';
import GradientButton from '../components/GradientButton';

export default function ScannerScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useLang();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [showManual, setShowManual] = useState(false);
  
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
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
        <Text style={{ color: theme.text, textAlign: 'center', marginTop: 100 }}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }
  
  if (hasPermission === false) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={styles.centered}>
          <Ionicons name="camera-off" size={80} color={theme.red} />
          <Text style={[styles.permText, { color: theme.text }]}>{t('permissionDenied')}</Text>
          <GradientButton title={t('grantPermission')} onPress={async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
          }} style={{ marginTop: 20 }} />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
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
});`,

  'src/screens/ResultScreen.js': `import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import FlagCard from '../components/FlagCard';
import GradientButton from '../components/GradientButton';

export default function ResultScreen({ route, navigation }) {
  const { product } = route.params;
  const { theme } = useTheme();
  const { t } = useLang();
  
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
        <FlagCard type="red" title={t('redFlags')} items={product.reds || []} />
        <FlagCard type="green" title={t('greenFlags')} items={product.greens || []} />
        <FlagCard type="white" title={t('whiteFlags')} items={product.whites || []} />
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
});`,

  'src/screens/ExplainScreen.js': `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';

export default function ExplainScreen() {
  const { theme } = useTheme();
  const { t } = useLang();
  
  const sections = [
    {
      emoji: '🟢', color: theme.green, title: t('greenFlags'), desc: t('greenDesc'),
      examples: ['🥦 Vegetables & Fruits', '🌾 Whole grains (oats, brown rice)', '🥜 Nuts & seeds', '🐟 Fish, lean protein', '🍯 Natural honey', '🌿 Herbs & spices'],
      simple: 'THINK: Food your grandma would recognize. Things that grow from the ground or come from animals without being changed in a factory.',
    },
    {
      emoji: '🚩', color: theme.red, title: t('redFlags'), desc: t('redDesc'),
      examples: ['🍬 High fructose corn syrup', '🎨 Artificial colors (Red 40, Yellow 5)', '🧪 Aspartame, Saccharin', '🥓 Sodium nitrite (in processed meat)', '🛢️ Hydrogenated oils (trans fats)', '⚗️ BHA, BHT preservatives'],
      simple: "THINK: If you can't say the word, or it sounds like science class, your body probably doesn't want it. These can make you sick over time.",
    },
    {
      emoji: '⚪', color: theme.white, title: t('whiteFlags'), desc: t('whiteDesc'),
      examples: ['🧂 Salt (needed but not too much)', '🍚 Regular sugar', '🧊 Citric acid (usually safe)', '🌽 Modified starch', '🥄 Natural flavors (vague)', '🍬 Stevia, sucralose'],
      simple: "THINK: Not great, not awful. Like a messy friend - okay sometimes, but don't live with them. Eat these once in a while, not every day.",
    },
  ];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[theme.accent, theme.accentAlt]} style={styles.header}>
          <Text style={styles.headerTitle}>📚 {t('explainTitle')}</Text>
          <Text style={styles.headerSub}>Simple truth. No confusion.</Text>
        </LinearGradient>
        {sections.map((s, idx) => (
          <View key={idx} style={[styles.card, { backgroundColor: theme.card, borderColor: s.color }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.emoji}>{s.emoji}</Text>
              <Text style={[styles.cardTitle, { color: s.color }]}>{s.title}</Text>
            </View>
            <Text style={[styles.cardDesc, { color: theme.text }]}>{s.desc}</Text>
            <View style={[styles.simpleBox, { backgroundColor: theme.cardAlt }]}>
              <Text style={[styles.simpleLabel, { color: s.color }]}>💡 SIMPLY PUT:</Text>
              <Text style={[styles.simpleText, { color: theme.text }]}>{s.simple}</Text>
            </View>
            <Text style={[styles.examplesTitle, { color: theme.textSecondary }]}>Examples:</Text>
            {s.examples.map((ex, i) => (
              <Text key={i} style={[styles.example, { color: theme.text }]}>{ex}</Text>
            ))}
          </View>
        ))}
        <View style={[styles.ruleCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.ruleTitle, { color: theme.accent }]}>🎯 Golden Rules</Text>
          <Text style={[styles.ruleItem, { color: theme.text }]}>1️⃣ If the ingredient list is longer than 5 things, be careful.</Text>
          <Text style={[styles.ruleItem, { color: theme.text }]}>2️⃣ If you can't pronounce it, your body can't process it well.</Text>
          <Text style={[styles.ruleItem, { color: theme.text }]}>3️⃣ Real food usually doesn't need a barcode. 🍎🥕</Text>
          <Text style={[styles.ruleItem, { color: theme.text }]}>4️⃣ "Sugar-free" often means fake sugar. Not always better.</Text>
          <Text style={[styles.ruleItem, { color: theme.text }]}>5️⃣ Sugar hides under 50+ names (dextrose, maltose, syrup...).</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  header: { borderRadius: 24, padding: 24, marginBottom: 16 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '900' },
  headerSub: { color: '#fff', fontSize: 14, marginTop: 6, opacity: 0.95 },
  card: { borderRadius: 22, padding: 20, marginBottom: 16, borderLeftWidth: 6 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  emoji: { fontSize: 32 },
  cardTitle: { fontSize: 24, fontWeight: '900', marginLeft: 10 },
  cardDesc: { fontSize: 15, lineHeight: 22, marginBottom: 14, fontWeight: '600' },
  simpleBox: { padding: 14, borderRadius: 14, marginBottom: 14 },
  simpleLabel: { fontSize: 12, fontWeight: '900', marginBottom: 6, letterSpacing: 1 },
  simpleText: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  examplesTitle: { fontSize: 12, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase' },
  example: { fontSize: 14, marginVertical: 3, fontWeight: '600' },
  ruleCard: { borderRadius: 22, padding: 20, marginTop: 8 },
  ruleTitle: { fontSize: 18, fontWeight: '900', marginBottom: 12 },
  ruleItem: { fontSize: 14, marginVertical: 6, lineHeight: 20, fontWeight: '600' },
});`,

  'src/screens/HistoryScreen.js': `import React, { useState, useEffect } from 'react';
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
});`,

  'src/screens/SettingsScreen.js': `import React from 'react';
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
});`,

  '.gitignore': `node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
.DS_Store
.env`,

  'README.md': `# TrustIssues 🚩

A Gen-Z food scanner app that exposes red/green/white flags in your food.

## 🚀 Quick Start

\\\`\\\`\\\`bash
npm install
npx expo start
\\\`\\\`\\\`

Scan the QR with **Expo Go** app on your phone.

## ✨ Features
- 🔍 Barcode scanning (Open Food Facts API)
- 🚩 Red/Green/White flag analyzer
- 🌐 4 languages (EN, ES, HI, FR)
- 🎨 4 themes (Dark, Light, Neon, Sunset)
- 📚 Simple explanations for everyone
- 📱 Offline scan history

## 📱 Test Barcodes
- \`737628064502\` (Thai Peanut noodles)
- \`3017620422003\` (Nutella)
- \`5449000000996\` (Coca-Cola)
`
};

console.log('🚀 Creating TrustIssues project...\n');

let count = 0;
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Created: ${filePath}`);
  count++;
});

console.log(`\n🎉 Done! Created ${count} files.\n`);
console.log('📦 Next steps:');
console.log('  1. npm install');
console.log('  2. npx expo start');
console.log('  3. Scan QR with Expo Go app\n');