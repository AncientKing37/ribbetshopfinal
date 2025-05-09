import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, '../public/uploads');
const WEBP_QUALITY = 80;

async function convertImage(inputPath) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
      return;
    }

    const webpPath = inputPath.replace(ext, '.webp');
    
    // Convert to WebP
    await sharp(inputPath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);

    console.log(`Converted: ${inputPath} -> ${webpPath}`);
    
    // Delete original file
    await fs.unlink(inputPath);
    console.log(`Deleted original: ${inputPath}`);
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

async function processDirectory(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (entry.isFile()) {
        await convertImage(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error);
  }
}

console.log('Starting image conversion...');
processDirectory(UPLOADS_DIR)
  .then(() => console.log('Image conversion completed!'))
  .catch(error => console.error('Error during conversion:', error)); 