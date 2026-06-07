#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const version = '28.3.3';
const electronMirror = 'https://npmmirror.com/mirrors/electron/';
const platform = process.platform;
const arch = process.arch === 'x64' ? 'x64' : (process.arch === 'arm64' ? 'arm64' : 'x64');

const electronDir = path.join(__dirname, '..', 'node_modules', 'electron');
const distDir = path.join(electronDir, 'dist');
const electronBinary = platform === 'win32' ? 'electron.exe' : 'electron';
const electronPath = path.join(distDir, electronBinary);

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;

    console.log(`Downloading ${url}...`);

    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        file.close();
        return downloadFile(redirectUrl, dest).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Download failed with status ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        fs.chmodSync(dest, 0o755);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  try {
    fs.mkdirSync(distDir, { recursive: true });

    const zipName = platform === 'win32' ? 'electron-win32-x64.zip' :
                    platform === 'darwin' ? `electron-darwin-${arch}-${version}.zip` :
                    `electron-linux-${arch}-${version}.zip`;

    const zipPath = path.join(distDir, zipName);
    const zipUrl = `${electronMirror}${version}/${zipName}`;

    console.log(`Platform: ${platform}, Arch: ${arch}`);
    console.log(`Downloading Electron ${version} from mirror...`);

    await downloadFile(zipUrl, zipPath);

    console.log('Extracting...');
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(distDir, true);

    fs.unlinkSync(zipPath);

    const extractedDir = path.join(distDir, platform === 'win32' ? 'electron-win32-x64' :
                      platform === 'darwin' ? `Electron.app` :
                      `electron-linux-${arch}`);
    const sourceBinary = platform === 'win32' ? 'electron.exe' :
                        platform === 'darwin' ? 'Electron.app/Contents/MacOS/Electron' :
                        'electron';

    if (platform !== 'darwin') {
      const srcPath = path.join(extractedDir, sourceBinary);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, electronPath);
        fs.chmodSync(electronPath, 0o755);
        fs.rmSync(extractedDir, { recursive: true, force: true });
      }
    }

    console.log(`Electron ${version} installed successfully!`);
  } catch (error) {
    console.error('Failed to install Electron:', error.message);
    console.log('\nYou can manually download Electron from:');
    console.log(`https://github.com/electron/electron/releases/tag/v${version}`);
    process.exit(1);
  }
}

main();
