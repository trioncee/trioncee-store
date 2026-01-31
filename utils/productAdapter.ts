
import collectionsDataRaw from '../data/collections.json';
import { Product, CollectionData } from '../types';

const collectionsData = collectionsDataRaw as CollectionData;

export const generateProductsFromCollections = (): Product[] => {
    const products: Product[] = [];

    Object.entries(collectionsData).forEach(([category, collections]) => {
        Object.entries(collections).forEach(([collectionName, images]) => {
            if (images.length === 0) return;

            // Construct a unique ID
            const id = `${category}-${collectionName}`;

            // Use the first image as the main one, and all images as gallery
            const mainImage = images[0];

            products.push({
                id: id,
                name: category === 'Hoodies' ? `${category} Collection ${collectionName}` : `${category} Collection ${collectionName}`,
                price: category === 'Hoodies' ? 1 : 1, // Test price for ALL Hoodies
                description: `Premium ${category} from our exclusive Collection ${collectionName}. Features high-quality fabric and modern fit.`,
                images: images,
                category: category,
                colors: ['Black', 'Navy', 'Grey'], // Default options
                sizes: ['S', 'M', 'L', 'XL', 'XXL'] // Default options
            });
        });
    });

    return products;
};
