export type Item = {
    id: string;
    name: string;
    location: string;
    category?: string;
    imageUri?: string;
    barcode?: string;
    createdAt: Date;
    usageHistory?: Date[];
    reminder?: Date;
};

export const DEFAULT_CATEGORIES = [
    'Electronics',
    'Kitchen',
    'Clothing',
    'Tools',
    'Documents',
    'Decorations',
    'Toys',
    'Sports',
    'Other'
];