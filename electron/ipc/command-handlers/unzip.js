import AdmZip from 'adm-zip';

export class UnzipCommandHandler {
  constructor({ sendOutput, fs, path }) {
    this.name = 'unzip';
    this.description = 'unzip files';
    this.sendOutput = sendOutput;
    this.fs = fs;
    this.path = path;
  }

  async execute(args) {
    try {
      console.log('[UnzipCommandHandler] 接收到的参数:', args);
      
      if (args.length < 2) {
        this.sendOutput('Error: Usage unzip <zipFile> <targetDir>\r\n');
        return false;
      }

      const zipPath = args[0];
      const targetDir = args[1];
      
      console.log('[UnzipCommandHandler] zipPath:', zipPath);
      console.log('[UnzipCommandHandler] targetDir:', targetDir);

      this.sendOutput('Starting extraction...\r\n');
      this.sendOutput(`Zip path: ${zipPath}\r\n`);
      this.sendOutput(`Target dir: ${targetDir}\r\n`);

      if (!this.fs.existsSync(zipPath)) {
        this.sendOutput(`Error: Zip file not found: ${zipPath}\r\n`);
        return false;
      }

      if (this.fs.existsSync(targetDir)) {
        this.sendOutput('Removing existing folder...\r\n');
        const deleteFolderRecursive = (folderPath) => {
          if (this.fs.existsSync(folderPath)) {
            this.fs.readdirSync(folderPath).forEach((file) => {
              const curPath = this.path.join(folderPath, file);
              if (this.fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
              } else {
                this.fs.unlinkSync(curPath);
              }
            });
            this.fs.rmdirSync(folderPath);
          }
        };
        deleteFolderRecursive(targetDir);
      }

      this.fs.mkdirSync(targetDir, { recursive: true });

      this.sendOutput('Extracting...\r\n');
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(targetDir, true);

      this.sendOutput('Extraction complete!\r\n');

      return true;
    } catch (error) {
      console.error('[UnzipCommandHandler] Error:', error);
      this.sendOutput(`Extraction failed: ${error.message}\r\n`);
      return false;
    }
  }
}
