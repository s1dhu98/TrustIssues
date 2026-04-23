const RED_FLAG_INGREDIENTS = {
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