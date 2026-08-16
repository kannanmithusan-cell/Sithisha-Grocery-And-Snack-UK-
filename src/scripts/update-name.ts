import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import connectToDatabase from '../lib/db';
import Settings from '../models/Settings';
import HomepageConfig from '../models/HomepageConfig';

async function updateAllNameReferences() {
  console.log('Connecting to MongoDB Atlas...');
  await connectToDatabase();

  // 1. Update Settings collection
  await Settings.updateMany({}, { storeName: 'Sithisha Masala&snacks' });
  console.log('✅ All store settings updated in database to: Sithisha Masala&snacks');

  // 2. Update HomepageConfig collection hero badges & subtitles in MongoDB Atlas
  const configs = await HomepageConfig.find();
  for (const config of configs) {
    let modified = false;

    if (Array.isArray(config.heroImages)) {
      config.heroImages.forEach((hero: any) => {
        if (hero.badge && hero.badge.includes('GROCERY')) {
          hero.badge = hero.badge.replace(/GROCERY/g, 'MASALA');
          modified = true;
        }
        if (hero.description && hero.description.includes('grocery')) {
          hero.description = hero.description.replace(/grocery/gi, 'masala & snack');
          modified = true;
        }
      });
    }

    if (Array.isArray(config.editorialImages)) {
      config.editorialImages.forEach((edit: any) => {
        if (edit.subtitle && edit.subtitle.includes('Grocery')) {
          edit.subtitle = edit.subtitle.replace(/Grocery/gi, 'Masala & Snacks');
          modified = true;
        }
      });
    }

    if (modified) {
      await config.save();
      console.log('✅ HomepageConfig updated in MongoDB Atlas!');
    }
  }

  process.exit(0);
}

updateAllNameReferences();
