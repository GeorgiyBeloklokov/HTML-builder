const { readdir, rm } = require('node:fs/promises');
const path = require('path');
const fs = require('fs');

const deleteDist = async () => {
  await rm(path.resolve(__dirname, 'project-dist', 'bundle.css'), { recursive: true, force: true });
};

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
        fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data, (err) => {
          if (err) throw err;
        })
      );
    }
  });
}
/* bundleCss().catch(`Error:`, console.error); */

const mainFunction = async () => {
  await deleteDist();
  await bundleCss();

  return true;
};
mainFunction().catch(`Error:`, console.error);
