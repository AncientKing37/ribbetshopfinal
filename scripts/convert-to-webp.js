import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { unlinkSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputFile = join(__dirname, '../public/uploads/crew-bg.png');
const outputFile = join(__dirname, '../public/uploads/crew-bg.webp');

try {
  await sharp(inputFile)
    .webp({ quality: 80 })
    .toFile(outputFile);
  console.log('Image converted successfully');
  
  unlinkSync(inputFile);
  console.log('Original file deleted');
} catch (err) {
  console.error('Error:', err);
} 