import fs from 'fs';
import path from 'path';
import { AppData, Product, Order, ContactMessage, SiteContent, FlashSaleItem } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_FLASH,
  INITIAL_QUOTES,
  INITIAL_CONTENT,
  INITIAL_ORDERS,
  INITIAL_CONTACTS,
  INITIAL_USERS,
} from './initialData';

const DATA_FILE = path.join(process.cwd(), 'data_store.json');

// Global in-memory cache to ensure speed and stability
let cachedData: AppData | null = null;

export function getInitialAppData(): AppData {
  return {
    products: JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),
    flash: JSON.parse(JSON.stringify(INITIAL_FLASH)),
    quotes: JSON.parse(JSON.stringify(INITIAL_QUOTES)),
    content: JSON.parse(JSON.stringify(INITIAL_CONTENT)),
    orders: JSON.parse(JSON.stringify(INITIAL_ORDERS)),
    contacts: JSON.parse(JSON.stringify(INITIAL_CONTACTS)),
    users: JSON.parse(JSON.stringify(INITIAL_USERS)),
  };
}

export function readStore(): AppData {
  if (cachedData) {
    return cachedData;
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      cachedData = JSON.parse(raw);
      if (cachedData && cachedData.products && cachedData.content) {
        let addedNew = false;
        if (!cachedData.users || !Array.isArray(cachedData.users)) {
          cachedData.users = JSON.parse(JSON.stringify(INITIAL_USERS));
          addedNew = true;
        }
        // Ensure sales boosters settings exist
        if (!cachedData.content.settings.boosters) {
          cachedData.content.settings.boosters = JSON.parse(JSON.stringify(INITIAL_CONTENT.settings.boosters));
          addedNew = true;
        }
        // Ensure notifications settings exist
        if (!cachedData.content.settings.notifications) {
          cachedData.content.settings.notifications = JSON.parse(JSON.stringify(INITIAL_CONTENT.settings.notifications));
          addedNew = true;
        }
        // Ensure language configuration exists and English is enabled
        if (!cachedData.content.settings.languages) {
          cachedData.content.settings.languages = JSON.parse(JSON.stringify(INITIAL_CONTENT.settings.languages));
          addedNew = true;
        } else {
          if (cachedData.content.settings.languages.enableEn === undefined) {
            cachedData.content.settings.languages.enableEn = true;
            addedNew = true;
          }
        }
        // Backfill English content strings
        if (cachedData.content.hero) {
          if (!cachedData.content.hero.img || cachedData.content.hero.img.includes('picsum.photos')) {
            cachedData.content.hero.img = '/images/jewelry_hero_bg.jpg';
            addedNew = true;
          }
          if (!cachedData.content.hero.h1_en) {
            cachedData.content.hero.tag_en = INITIAL_CONTENT.hero.tag_en;
            cachedData.content.hero.h1_en = INITIAL_CONTENT.hero.h1_en;
            cachedData.content.hero.h1_em_en = INITIAL_CONTENT.hero.h1_em_en;
            cachedData.content.hero.p_en = INITIAL_CONTENT.hero.p_en;
            addedNew = true;
          }
        }
        if (cachedData.content.marquee && !cachedData.content.marquee.en) {
          cachedData.content.marquee.en = INITIAL_CONTENT.marquee.en;
          addedNew = true;
        }
        if (cachedData.content.craft && !cachedData.content.craft.h2_en) {
          cachedData.content.craft.h2_en = INITIAL_CONTENT.craft.h2_en;
          cachedData.content.craft.p1_en = INITIAL_CONTENT.craft.p1_en;
          cachedData.content.craft.p2_en = INITIAL_CONTENT.craft.p2_en;
          addedNew = true;
        }
        if (cachedData.content.flashBanner && !cachedData.content.flashBanner.title_en) {
          cachedData.content.flashBanner.title_en = INITIAL_CONTENT.flashBanner.title_en;
          cachedData.content.flashBanner.sub_en = INITIAL_CONTENT.flashBanner.sub_en;
          addedNew = true;
        }
        if (cachedData.quotes) {
          for (let i = 0; i < cachedData.quotes.length; i++) {
            if (!cachedData.quotes[i].t_en && INITIAL_QUOTES[i]?.t_en) {
              cachedData.quotes[i].t_en = INITIAL_QUOTES[i].t_en;
              cachedData.quotes[i].a_en = INITIAL_QUOTES[i].a_en;
              addedNew = true;
            }
          }
        }
        // Ensure new catalog items (such as Sacs collection) are merged if missing
        const existingIds = new Set(cachedData.products.map((p) => p.id));
        for (const initP of INITIAL_PRODUCTS) {
          if (!existingIds.has(initP.id)) {
            cachedData.products.push(JSON.parse(JSON.stringify(initP)));
            addedNew = true;
          } else {
            // Backfill images, video, and English translations if missing
            const found = cachedData.products.find((p) => p.id === initP.id);
            if (found) {
              if ((!found.images || found.images.length === 0) && initP.images && initP.images.length > 0) {
                found.images = JSON.parse(JSON.stringify(initP.images));
                addedNew = true;
              }
              if (!found.video && initP.video) {
                found.video = initP.video;
                addedNew = true;
              }
              if (!found.name_en && initP.name_en) {
                found.name_en = initP.name_en;
                addedNew = true;
              }
              if (!found.cat_en && initP.cat_en) {
                found.cat_en = initP.cat_en;
                addedNew = true;
              }
              if (found.badge_en === undefined && initP.badge_en !== undefined) {
                found.badge_en = initP.badge_en;
                addedNew = true;
              }
              if (!found.desc_en && initP.desc_en) {
                found.desc_en = initP.desc_en;
                addedNew = true;
              }
              if ((!found.specs_en || found.specs_en.length === 0) && initP.specs_en) {
                found.specs_en = JSON.parse(JSON.stringify(initP.specs_en));
                addedNew = true;
              }
            }
          }
        }
        if (addedNew) {
          try {
            fs.writeFileSync(DATA_FILE, JSON.stringify(cachedData, null, 2), 'utf-8');
          } catch (e) {
            console.error('Error syncing updated products to data file:', e);
          }
        }
        return cachedData;
      }
    }
  } catch (err) {
    console.error('Error reading data file, falling back to initial data:', err);
  }

  cachedData = getInitialAppData();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(cachedData, null, 2), 'utf-8');
  } catch (writeErr) {
    console.error('Could not write initial file:', writeErr);
  }
  return cachedData;
}

export function writeStore(data: AppData): void {
  cachedData = data;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing data file:', err);
  }
}

export function resetStore(): AppData {
  const fresh = getInitialAppData();
  writeStore(fresh);
  return fresh;
}
