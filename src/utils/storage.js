import AsyncStorage from '@react-native-async-storage/async-storage';

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
}