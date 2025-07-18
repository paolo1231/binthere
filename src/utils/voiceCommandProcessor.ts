/**
 * Voice Command Processor
 * 
 * This utility processes voice commands and extracts structured data from them.
 * It uses simple pattern matching to identify item names and locations.
 */

interface ProcessedVoiceCommand {
    itemName: string;
    itemLocation: string;
    category?: string;
}

/**
 * Process a voice command to extract item name and location
 * @param voiceText The text from voice recognition
 * @returns Object containing extracted item name and location
 */
export const processVoiceCommand = (voiceText: string): ProcessedVoiceCommand | null => {
    if (!voiceText) return null;

    // Convert to lowercase for easier matching
    const text = voiceText.trim();

    // Try to match patterns like "item in location" or "item at location"
    const inPattern = /(.+?)\s+(?:in|at)\s+(.+)/i;
    const match = text.match(inPattern);

    if (match && match.length >= 3) {
        return {
            itemName: match[1].trim(),
            itemLocation: match[2].trim(),
        };
    }

    // If no pattern match, assume the entire text is the item name
    return {
        itemName: text,
        itemLocation: '',
    };
};

/**
 * Extract category from voice command if possible
 * @param voiceText The text from voice recognition
 * @param categories Available categories to match against
 * @returns The matched category or undefined
 */
export const extractCategoryFromVoice = (
    voiceText: string,
    categories: string[]
): string | undefined => {
    if (!voiceText || !categories.length) return undefined;

    const lowerText = voiceText.toLowerCase();

    // Look for "category: X" pattern
    const categoryPattern = /category\s*:\s*([a-z0-9\s]+)/i;
    const match = lowerText.match(categoryPattern);

    if (match && match[1]) {
        const mentionedCategory = match[1].trim().toLowerCase();

        // Find the closest matching category
        return categories.find(cat =>
            cat.toLowerCase() === mentionedCategory ||
            cat.toLowerCase().includes(mentionedCategory) ||
            mentionedCategory.includes(cat.toLowerCase())
        );
    }

    // If no explicit category mention, try to find category words in the text
    return categories.find(cat =>
        lowerText.includes(cat.toLowerCase())
    );
};

/**
 * Process a more complex voice command with multiple parameters
 * @param voiceText The text from voice recognition
 * @param categories Available categories to match against
 * @returns Object containing all extracted information
 */
export const processComplexVoiceCommand = (
    voiceText: string,
    categories: string[] = []
): ProcessedVoiceCommand => {
    const basicResult = processVoiceCommand(voiceText) || {
        itemName: voiceText,
        itemLocation: ''
    };

    // Try to extract category if categories are provided
    if (categories.length > 0) {
        basicResult.category = extractCategoryFromVoice(voiceText, categories);
    }

    return basicResult;
};