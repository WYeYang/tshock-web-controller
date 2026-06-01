// 合并buff数据和翻译
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载数据
const rawDataPath = path.join(__dirname, '../src/data/buffs-raw.json');
const translationsPath = path.join(__dirname, '../src/data/buffs-translations.json');

const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf-8'));
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf-8'));

// 判断buff类型
function getBuffType(name) {
  const lowerName = name.toLowerCase();
  
  // 减益效果
  if (
    lowerName.includes('poison') || 
    lowerName.includes('fire') || 
    lowerName.includes('burn') || 
    lowerName.includes('frost') || 
    lowerName.includes('freeze') || 
    lowerName.includes('dark') || 
    lowerName.includes('curse') || 
    lowerName.includes('slow') || 
    lowerName.includes('weak') || 
    lowerName.includes('confuse') || 
    lowerName.includes('bleed') || 
    lowerName.includes('silence') || 
    lowerName.includes('broken') || 
    lowerName.includes('horrify') || 
    lowerName.includes('cursed') || 
    lowerName.includes('ichor') || 
    lowerName.includes('venom') || 
    lowerName.includes('shadowflame') || 
    lowerName.includes('blackout') || 
    lowerName.includes('electrify') || 
    lowerName.includes('moon bite') || 
    lowerName.includes('web') || 
    lowerName.includes('stoned') || 
    lowerName.includes('daze') || 
    lowerName.includes('obstruct') || 
    lowerName.includes('distort') || 
    lowerName.includes('penetrate') || 
    lowerName.includes('celled') || 
    lowerName.includes('bane') || 
    lowerName.includes('daybreak') || 
    lowerName.includes('wither') || 
    lowerName.includes('ooze') || 
    lowerName.includes('shock') || 
    lowerName.includes('betsy') || 
    lowerName.includes('oil') || 
    lowerName.includes('sickness')
  ) {
    return 'debuff';
  }
  
  // 宠物
  if (
    lowerName.includes('pet') || 
    lowerName.includes('baby') || 
    lowerName.includes('fairy') || 
    lowerName.includes('wisp') || 
    lowerName.includes('companion') || 
    lowerName.includes('flickerwick') || 
    lowerName.includes('hoardagron') || 
    lowerName.includes('propeller')
  ) {
    return 'pet';
  }
  
  // 坐骑
  if (
    lowerName.includes('mount') || 
    lowerName.includes('minecart') || 
    lowerName.includes('rudolph')
  ) {
    return 'mount';
  }
  
  // 召唤物
  if (
    lowerName.includes('summon') || 
    lowerName.includes('pygmy') || 
    lowerName.includes('raven') || 
    lowerName.includes('spider') || 
    lowerName.includes('twins') || 
    lowerName.includes('pirate') || 
    lowerName.includes('minotaur') || 
    lowerName.includes('sharknado') || 
    lowerName.includes('ufo') || 
    lowerName.includes('deadly sphere') || 
    lowerName.includes('stardust') || 
    lowerName.includes('hornet') || 
    lowerName.includes('imp')
  ) {
    return 'summon';
  }
  
  // 默认为增益
  return 'buff';
}

// 合并数据
const buffs = {};
let missingTranslations = [];

for (const item of rawData) {
  const id = item.id.toString();
  const translation = translations[id];
  
  const zhName = translation?.name || item.en;
  const zhDesc = translation?.description || item.desc;
  
  if (!translation) {
    missingTranslations.push(id);
  }
  
  buffs[id] = {
    en: item.en,
    zh: zhName,
    desc: item.desc,
    zhDesc: zhDesc,
    type: getBuffType(item.en)
  };
}

// 保存
const outputPath = path.join(__dirname, '../src/data/buffs.json');
fs.writeFileSync(outputPath, JSON.stringify(buffs, null, 2));

console.log(`✅ 已生成 ${Object.keys(buffs).length} 个buff数据`);
console.log(`保存到: ${outputPath}`);

if (missingTranslations.length > 0) {
  console.log(`\n⚠️  缺少翻译的buff ID: ${missingTranslations.join(', ')}`);
  console.log('请在 buffs-translations.json 中添加对应翻译');
}

console.log("\n示例:");
console.log(buffs["33"]);
