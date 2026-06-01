// 参考wiki: https://terraria.wiki.gg/wiki/Item_IDs
// 参考wiki: https://terraria.wiki.gg/zh/wiki/物品_ID
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    console.log(`  请求: ${url.substring(0, 80)}...`);
    
    const options = {
      headers: {
        'User-Agent': 'TerrariaItemFetcher/1.0 (https://github.com/example)',
        'Accept': 'application/json'
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`  状态: ${res.statusCode}, 大小: ${data.length} bytes`);
        resolve(data);
      });
    }).on('error', (err) => {
      console.error(`  错误: ${err.message}`);
      reject(err);
    });
  });
}

async function getWikiData(page, wiki = 'en') {
  try {
    const baseUrl = wiki === 'zh' 
      ? 'https://terraria.wiki.gg/zh/api.php'
      : 'https://terraria.wiki.gg/api.php';
    
    const params = new URLSearchParams({
      action: 'parse',
      page: page,
      format: 'json'
    });
    
    const response = await fetchUrl(`${baseUrl}?${params}`);
    return JSON.parse(response);
  } catch (err) {
    console.error(`  获取 ${page} 失败: ${err.message}`);
    return null;
  }
}

function parseHtmlItems(html) {
  const items = {};
  
  const tableMatch = html.match(/<table[^>]*class="[^"]*sortable[^"]*"[^>]*>([\s\S]*?)<\/table>/);
  
  if (!tableMatch) {
    console.log('  未找到表格');
    return items;
  }
  
  const tableContent = tableMatch[1];
  
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  
  while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
    const rowContent = rowMatch[1];
    
    const tdRegex = /<td[^>]*>(\d+)<\/td>\s*<td[^>]*>(?:<a[^>]*>)?([^<]+)(?:<\/a>)?<\/td>\s*<td[^>]*>/gi;
    const tdMatch = tdRegex.exec(rowContent);
    
    if (tdMatch) {
      const id = tdMatch[1];
      let name = tdMatch[2].trim();
      
      name = name.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      
      if (name && id && !isNaN(parseInt(id))) {
        items[id] = {
          en: name
        };
      }
    }
  }
  
  return items;
}

function parseHtmlItemsChinese(html) {
  const items = {};
  
  const tableMatch = html.match(/<table[^>]*class="[^"]*sortable[^"]*"[^>]*>([\s\S]*?)<\/table>/i);
  
  if (!tableMatch) {
    console.log('  未找到中文表格');
    return items;
  }
  
  const tableContent = tableMatch[1];
  
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  
  while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
    const rowContent = rowMatch[1];
    
    const tdRegex = /<td[^>]*>(\d+)<\/td>\s*<td[^>]*>(?:<a[^>]*>)?([^<]+)(?:<\/a>)?<\/td>/gi;
    const tdMatch = tdRegex.exec(rowContent);
    
    if (tdMatch) {
      const id = tdMatch[1];
      let name = tdMatch[2].trim();
      
      name = name.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      
      if (name && id && !isNaN(parseInt(id))) {
        items[id] = {
          zh: name
        };
      }
    }
  }
  
  return items;
}

async function getEnglishItems() {
  console.log('通过API获取英文物品列表...\n');
  
  try {
    const data = await getWikiData('Item_IDs', 'en');
    
    if (!data || !data.parse || !data.parse.text || !data.parse.text['*']) {
      console.log('  API返回数据为空\n');
      return {};
    }
    
    const html = data.parse.text['*'];
    console.log(`  HTML长度: ${html.length} bytes`);
    
    const items = parseHtmlItems(html);
    console.log(`  解析到 ${Object.keys(items).length} 个英文物品\n`);
    
    return items;
  } catch (err) {
    console.error(`  解析失败: ${err.message}\n`);
    return {};
  }
}

async function getChineseItems() {
  console.log('通过API获取中文物品列表...\n');
  
  try {
    const pages = ['物品_ID', '物品ID列表', '物品ID'];
    let data = null;
    
    for (const page of pages) {
      console.log(`  尝试页面: ${page}`);
      data = await getWikiData(page, 'zh');
      
      if (data && data.parse && data.parse.text && data.parse.text['*'] && data.parse.text['*'].length > 1000) {
        console.log(`  ✓ 找到: ${page}`);
        break;
      }
    }
    
    if (!data || !data.parse || !data.parse.text || !data.parse.text['*']) {
      console.log('  无法获取中文数据\n');
      return {};
    }
    
    const html = data.parse.text['*'];
    console.log(`  HTML长度: ${html.length} bytes`);
    
    const items = parseHtmlItemsChinese(html);
    console.log(`  解析到 ${Object.keys(items).length} 个中文物品\n`);
    
    return items;
  } catch (err) {
    console.error(`  解析失败: ${err.message}\n`);
    return {};
  }
}

async function generateItemsJson() {
  console.log('=== Terraria 物品数据生成器 (Wiki API) ===\n');
  
  try {
    const enItems = await getEnglishItems();
    const zhItems = await getChineseItems();
    
    const items = {};
    const allIds = new Set([...Object.keys(enItems), ...Object.keys(zhItems)]);
    
    console.log('合并数据...');
    for (const id of allIds) {
      const zh = zhItems[id];
      const en = enItems[id];
      
      if (zh || en) {
        items[id] = {
          en: en?.en || `Item ${id}`,
          zh: zh?.zh || en?.en || `物品 ${id}`
        };
      }
    }
    
    const outputPath = path.join(__dirname, '../src/data/items.json');
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
    
    console.log(`\n✅ 已生成 ${Object.keys(items).length} 个物品数据`);
    console.log(`保存到: ${outputPath}`);
    
    if (Object.keys(items).length > 0) {
      console.log('\n示例（前10个）:');
      let count = 0;
      for (const [id, item] of Object.entries(items)) {
        if (count < 10) {
          console.log(`  ${id.padStart(4)}: ${item.zh} (${item.en})`);
          count++;
        }
      }
    }
    
  } catch (err) {
    console.error('生成失败:', err);
    throw err;
  }
}

if (process.argv[1] === __filename) {
  generateItemsJson().catch(err => {
    console.error('错误:', err);
    process.exit(1);
  });
}

export { generateItemsJson };
