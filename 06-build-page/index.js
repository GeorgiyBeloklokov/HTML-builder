const { readdir, stat, mkdir, readFile, copyFile } = require('fs/promises');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    const dirCreation = await mkdir(path.join(__dirname, 'project-dist'), {
      recursive: true,
    });
    const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
    const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));

    let data = '';
    readStream.on('data', (chunk) => (data += chunk));
    readStream.on('end', async () => {
      const components = [...data.matchAll(/{{(.*)}}/g)];
      for (let item of components) {
        const pathOfFile = path.join(path.join(__dirname, 'components'), `${item[1]}.html`);
        const content = await readFile(pathOfFile);
        data = data.replace(item[0], content);
      }
      writeStream.write(data);
    });
    return dirCreation;
  } catch (error) {
    process.stderr.write('Error: ' + error.message);
    process.exit(1);
  }
})();

async function bundleCss() {
  const sourceFolder = path.join(__dirname, 'styles');
  const content = await readdir(sourceFolder, { withFileTypes: true });
  const files = content.filter((item) => item.isFile());

  files.forEach(async (item) => {
    const { ext } = path.parse(path.join(sourceFolder, item.name));
    if (ext === '.css') {
      const readStream = fs.createReadStream(path.join(sourceFolder, item.name), 'utf-8');
      let data = '';
      readStream.on('data', (chunk) => (data += chunk));
      readStream.on('end', () =>
        fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), data, (err) => {
          if (err) throw err;
        })
      );
    }
  });
}
bundleCss().catch(`Error:`, console.error);

async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  const content = await readdir(src);

  content.forEach(async (item) => {
    const sourceFile = path.join(src, item);
    const destFile = path.join(dest, item);
    const stats = await stat(sourceFile);
    if (stats.isFile()) await copyFile(sourceFile, destFile);
    else await copyDir(sourceFile, destFile);
  });
}
copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets')).catch(`Error:`, console.error);
