import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const IMAGES_ROOT = path.join(__dirname, '../public/home-images/tshirts');
const OUTPUT_FILE = path.join(__dirname, '../data/collections.json');
const PUBLIC_PREFIX = '/home-images/tshirts';

// Helper to get directories
const getDirectories = (source) =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

// Helper to get files
const getFiles = (source) =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => !dirent.isDirectory() && /\.(jpg|jpeg|png|webp|gif)$/i.test(dirent.name))
        .map(dirent => dirent.name);

function generateCollections() {
    console.log('Scanning collection images...');

    if (!fs.existsSync(IMAGES_ROOT)) {
        console.error(`Directory not found: ${IMAGES_ROOT}`);
        process.exit(1);
    }

    const categories = getDirectories(IMAGES_ROOT);
    const collectionsData = {};

    categories.forEach(category => {
        const categoryPath = path.join(IMAGES_ROOT, category);
        const collections = getDirectories(categoryPath);

        // Logic to sort collections numerically if possible, otherwise alphabetical
        collections.sort((a, b) => {
            const numA = parseInt(a);
            const numB = parseInt(b);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localeCompare(b);
        });

        collectionsData[category] = {};

        collections.forEach(collection => {
            const collectionPath = path.join(categoryPath, collection);
            const images = getFiles(collectionPath);

            // Map to public URLs
            const imageUrls = images.map(img => `${PUBLIC_PREFIX}/${category}/${collection}/${img}`);

            collectionsData[category][collection] = imageUrls;
        });
    });

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(collectionsData, null, 2));
    console.log(`Collections data generated at ${OUTPUT_FILE}`);
}

generateCollections();
