import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemsJsonPath = path.join(__dirname, '../src/data/items.json');
const itemsJson = JSON.parse(fs.readFileSync(itemsJsonPath, 'utf-8'));

const ITEMS_DIR = path.join(__dirname, '../public/images/items');

if (!fs.existsSync(ITEMS_DIR)) {
  fs.mkdirSync(ITEMS_DIR, { recursive: true });
}

const itemIds = Object.keys(itemsJson).map(id => parseInt(id)).filter(id => !isNaN(id) && id > 0);

console.log('Found ' + itemIds.length + ' items');

async function downloadImage(itemId) {
  const filePath = path.join(ITEMS_DIR, 'item_' + itemId + '.png');
  
  if (fs.existsSync(filePath)) {
    return { success: true, skipped: true };
  }

  const itemData = itemsJson[itemId];
  
  // 尝试的 URL 列表
  const urls = [];
  
  // 1. 先用物品名称（如 Terraria.wiki.gg/images/Minecart.png）
  if (itemData && itemData.en) {
    const formattedName = itemData.en.replace(/\s+/g, '_');
    urls.push('https://terraria.wiki.gg/images/' + formattedName + '.png');
  }
  
  // 2. 尝试用 ID 格式
  urls.push('https://terraria.wiki.gg/images/thumb/Item_' + itemId + '.png/48px-Item_' + itemId + '.png');
  
  for (let i = 0; i < urls.length; i++) {
    try {
      const response = await fetch(urls[i]);
      
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));
        return { success: true, url: urls[i] };
      }
    } catch (error) {
      // 继续尝试下一个 URL
    }
  }
  
  return { success: false, error: 'All URLs failed' };
}

async function downloadAllImages() {
  const failed = [];
  let skipped = 0;
  let downloaded = 0;

  for (let i = 0; i < itemIds.length; i++) {
    const itemId = itemIds[i];
    
    console.log('[' + (i + 1) + '/' + itemIds.length + '] Downloading item ' + itemId + '...');
    
    const result = await downloadImage(itemId);
    
    if (result.skipped) {
      skipped++;
    } else if (result.success) {
      downloaded++;
      console.log('  Success');
    } else {
      failed.push({ id: itemId, error: result.error });
      console.log('  Failed: ' + result.error);
    }

    if (!result.skipped) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log('\nDownload complete!');
  console.log('Downloaded: ' + downloaded);
  console.log('Skipped (exists): ' + skipped);
  console.log('Failed: ' + failed.length);

  if (failed.length > 0) {
    console.log('\nFailed items:');
    failed.forEach(item => {
      console.log('  - ID ' + item.id + ': ' + item.error);
    });

    const failedPath = path.join(ITEMS_DIR, 'failed.json');
    fs.writeFileSync(failedPath, JSON.stringify(failed, null, 2));
    console.log('\nFailed list saved to: ' + failedPath);
  }
}

downloadAllImages().catch(console.error);
