const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');

// 获取参数
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('使用方式: node unzip.js <zip路径> <目标目录>');
  process.exit(1);
}

const zipPath = args[0];
const targetDir = args[1];

console.log('开始解压...');
console.log(`Zip 路径: ${zipPath}`);
console.log(`目标目录: ${targetDir}`);

try {
  // 检查 zip 文件是否存在
  if (!fs.existsSync(zipPath)) {
    console.error(`错误: Zip 文件不存在: ${zipPath}`);
    process.exit(1);
  }

  // 如果目标目录存在，先删除
  if (fs.existsSync(targetDir)) {
    console.log('删除已存在的文件夹...');
    const deleteFolderRecursive = (folderPath) => {
      if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
          const curPath = path.join(folderPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
            deleteFolderRecursive(curPath);
          } else {
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(folderPath);
      }
    };
    deleteFolderRecursive(targetDir);
  }

  // 创建目标目录
  fs.mkdirSync(targetDir, { recursive: true });

  // 解压
  console.log('正在解压...');
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(targetDir, true);

  console.log('✅ 解压完成!');
  
  // 检测路径并设置
  const configPath = path.join(targetDir, 'tshock', 'config.json');
  const installerPath = path.join(targetDir, 'TShock.Installer.exe');
  const serverPath = path.join(targetDir, 'TerrariaServer.exe');

  console.log('解压路径:', targetDir);
  
  process.exit(0);
} catch (error) {
  console.error(`❌ 解压失败: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
}
