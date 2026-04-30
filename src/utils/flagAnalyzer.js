const RED_FLAG_INGREDIENTS = {
    'aspartame': 'Artificial sweetener linked to headaches and possible health risks',
    'saccharin': 'Artificial sweetener, possible carcinogen concerns',
    'acesulfame': 'Artificial sweetener, long-term effects unclear',
    'partially hydrogenated': 'Trans fat - increases heart disease risk',
    'hydrogenated': 'Often contains trans fats - bad for heart',
    'red 40': 'Artificial color, linked to hyperactivity in children',
    'red 3': 'Artificial color, banned in cosmetics for safety',
    'yellow 5': 'Artificial color, may cause allergic reactions',
    'yellow 6': 'Artificial color, hyperactivity concerns',
    'blue 1': 'Artificial color with allergy concerns',
    'blue 2': 'Artificial color, behavioral concerns',
    'tartrazine': 'Artificial yellow dye, allergy risks',
    'sodium nitrite': 'Preservative in processed meats, cancer risk',
    'sodium nitrate': 'Preservative, linked to cancer risk',
    'potassium nitrate': 'Preservative, linked to cancer risk',
    'bha': 'Preservative, possible carcinogen',
    'bht': 'Preservative, possible health concerns',
    'tbhq': 'Preservative, linked to vision issues',
    'potassium bromate': 'Flour treatment, banned in many countries',
    'high fructose corn syrup': 'Linked to obesity, diabetes, fatty liver',
    'corn syrup': 'Highly processed sugar',
    'monosodium glutamate': 'May cause headaches in sensitive people',
    'msg': 'May cause headaches in sensitive people',
    'carrageenan': 'Thickener, digestive issues concerns',
    'propyl gallate': 'Preservative, endocrine concerns',
    'sodium benzoate': 'Preservative, may form benzene',
    'palm': 'High saturated fat, environmental concerns (palm oil/olein)',
    'shortening': 'Often contains trans fats',
    'artificial flavor': 'Synthetic chemicals used for flavoring',
    'sucralose': 'Artificial sweetener, can disrupt gut microbiome',
    'high-fructose': 'Highly processed sugar linked to obesity',
    'maltodextrin': 'Highly processed carbohydrate, spikes blood sugar'
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
    'vitamin b1': 'Essential for metabolism',
    'vitamin b2': 'Essential for cell growth',
    'folic acid': 'Essential B vitamin (B9)',
    'niacin': 'Essential B vitamin (B3)',
    'thiamine': 'Essential B vitamin (B1)',
    'riboflavin': 'Essential B vitamin (B2)',
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
    'dextrose': 'Simple sugar',
    'glucose': 'Simple sugar',
    'stevia': 'Natural sweetener, mostly safe',
    'baking soda': 'Common leavening agent',
    'baking powder': 'Common leavening agent',
};

export function analyzeIngredients(ingredientsText) {
    if (!ingredientsText) return { greens: [], reds: [], whites: [], score: 50 };

    const extractIngredientsSection = (text) => {
        const lowerText = text.toLowerCase();
        const startIndexMatch = lowerText.match(/ingredients?\s*[\:\-\.]?\s*/);
        
        if (startIndexMatch && startIndexMatch.index > -1) {
            let section = text.substring(startIndexMatch.index + startIndexMatch[0].length);
            const endKeywords = [/manufactured by/i, /distributed by/i, /marketed by/i, /produced by/i, /allergy advice/i, /allergen/i, /net weight/i, /net wt/i, /store in/i, /best before/i, /expiry/i, /customer care/i, /contains:/i];
            let minEndIndex = section.length;
            for (let keyword of endKeywords) {
                const match = section.match(keyword);
                if (match && match.index > 5) {
                    if (match.index < minEndIndex) minEndIndex = match.index;
                }
            }
            return section.substring(0, minEndIndex).trim();
        }
        return text;
    };

    const cleanIngredient = (ing) => {
        return ing.toLowerCase()
            .replace(/^(organic|contains|made with|100%|pure|natural|artificial|processed with)\s+/g, '')
            .replace(/[\*\_]/g, '')
            .trim();
    };

    const NON_INGREDIENT_WORDS = [
        'manufactured', 'distributed', 'marketed', 'produced', 'packed', 'pvt', 'ltd', 'limited', 'private',
        'road', 'street', 'estate', 'nagar', 'delhi', 'mumbai', 'india', 'usa', 'uk', 'china', 'gmbh', 'inc', 'llc',
        'allergy', 'allergen', 'warning', 'store in', 'cool dry', 'best before', 'expiry', 'net weight', 'net wt',
        'customer care', 'toll free', 'website', 'email', 'fssai', 'lic', 'no.', 'www.', '.com', '.in', '@'
    ];

    const isIngredient = (ing) => {
        if (ing.length < 2) return false;
        if (/^[\d\s\.\-\%]+$/.test(ing)) return false; 
        if (NON_INGREDIENT_WORDS.some(w => ing.includes(w))) return false;
        return true;
    };

    const focusedText = extractIngredientsSection(ingredientsText);
    const flatText = focusedText.replace(/[\(\)\[\]\{\}]/g, ',');
    const parsedIngredients = flatText.split(',').map(i => cleanIngredient(i)).filter(isIngredient);
    const uniqueIngredients = [...new Set(parsedIngredients)];

    const greens = [], reds = [], whites = [];

    uniqueIngredients.forEach(ing => {
        let classified = false;

        // 1. Check exact dictionaries
        for (let [key, reason] of Object.entries(RED_FLAG_INGREDIENTS)) {
            if (ing.includes(key)) {
                reds.push({ name: ing, reason });
                classified = true;
                break;
            }
        }
        if (classified) return;

        for (let [key, reason] of Object.entries(GREEN_FLAG_INGREDIENTS)) {
            if (ing.includes(key)) {
                greens.push({ name: ing, reason });
                classified = true;
                break;
            }
        }
        if (classified) return;

        for (let [key, reason] of Object.entries(WHITE_FLAG_INGREDIENTS)) {
            if (ing.includes(key)) {
                whites.push({ name: ing, reason });
                classified = true;
                break;
            }
        }
        if (classified) return;

        // 2. If unknown, run algorithm
        const chemicalPatterns = [/acid\b/, /oxide\b/, /sulfate\b/, /phosphate\b/, /chloride\b/, /nitrate\b/, /poly/, /glycol/, /benzoate\b/, /sorbate\b/, /\d/, /gum\b/, /color\b/, /dye\b/];
        const naturalPatterns = [/extract\b/, /oil\b/, /juice\b/, /powder\b/, /leaf\b/, /seed\b/, /root\b/, /flour\b/, /water\b/, /milk\b/, /cocoa\b/, /bean\b/, /nut\b/, /fruit\b/, /starch\b/, /yeast\b/];

        if (chemicalPatterns.some(p => p.test(ing))) {
            reds.push({ name: ing, reason: 'Algorithmic Flag: Potential synthetic or chemical additive' });
        } else if (naturalPatterns.some(p => p.test(ing))) {
            greens.push({ name: ing, reason: 'Algorithmic Flag: Likely natural plant or base ingredient' });
        } else {
            whites.push({ name: ing, reason: 'Algorithmic Flag: Unclassified ingredient, moderate use advised' });
        }
    });

    let score = 50;
    score += greens.length * 4;
    score -= reds.length * 8;
    score -= whites.length * 1;
    score = Math.max(0, Math.min(100, score));

    return { greens, reds, whites, score };
}

export async function fetchProduct(barcode) {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
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
}