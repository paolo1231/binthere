export type Item = {
    id: string;
    name: string;
    location: string;
    imageUri?: string;
    barcode?: string;
    createdAt: Date;
    usageHistory?: Date[];
    reminder?: Date;
};