import * as ImageManipulator from 'expo-image-manipulator';

export async function performOCR(imageUri) {
    try {
        // Compress image to fit OCR API limits and reduce upload time
        const compressed = await ImageManipulator.manipulateAsync(
            imageUri,
            [{ resize: { width: 1200 } }],
            { compress: 0.5, base64: true }
        );

        const formData = new FormData();
        formData.append('base64Image', `data:image/jpeg;base64,${compressed.base64}`);
        formData.append('apikey', 'helloworld'); // Free test API key
        formData.append('language', 'eng');
        formData.append('detectOrientation', 'true');

        const response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
            }
        });

        const result = await response.json();

        if (result.IsErroredOnProcessing || !result.ParsedResults) {
            console.error('OCR Error:', result.ErrorMessage);
            return null;
        }

        const text = result.ParsedResults[0]?.ParsedText || '';
        return text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    } catch (e) {
        console.error('OCR Exception:', e);
        return null;
    }
}
