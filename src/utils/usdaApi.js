const USDA_API_KEY = 'LF3lapKjYB4HptepDQN4puGDg1D3nPpLU0ORDHbQ';

export async function fetchIngredientDetails(query) {
    try {
        const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=1`);
        const data = await response.json();
        
        if (!data.foods || data.foods.length === 0) {
            return null; // Ingredient not found in USDA database
        }
        
        const food = data.foods[0];
        
        // Extract top nutrients
        const targetNutrients = ['Protein', 'Total lipid (fat)', 'Carbohydrate, by difference', 'Energy', 'Sugars, total including NLEA', 'Sodium, Na'];
        const nutrients = food.foodNutrients
            .filter(n => targetNutrients.includes(n.nutrientName))
            .map(n => ({
                name: n.nutrientName.replace(', by difference', '').replace(', total including NLEA', '').replace(', Na', ''),
                value: n.value,
                unit: n.unitName
            }));

        return {
            description: food.description,
            brand: food.brandOwner || 'Generic',
            category: food.foodCategory || 'Unknown Category',
            nutrients: nutrients
        };
    } catch (error) {
        console.error('USDA API Error:', error);
        return null;
    }
}
