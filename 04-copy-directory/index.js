const { mkdir, copyFile, readdir } = require('node:fs/promises');
const path = require('path');

async function copyDir() {
  const projectFolder = path.join(__dirname, 'files-copy');
  const dirCreation = await mkdir(projectFolder, { recursive: true });
  const content = await readdir(path.join(__dirname, 'files'), {
    withFileTypes: true,
  });
  const files = content.filter((item) => item.isFile());

  files.forEach(async (item) => {
    const pathOfFile = path.join(path.join(__dirname, 'files'), item.name);
    await copyFile(pathOfFile, path.join(path.join(__dirname, 'files-copy'), item.name));
    console.log(`${item.name} was copied to files-copy`);
  });

  return dirCreation;
}

copyDir().catch(`Error:`, console.error);
