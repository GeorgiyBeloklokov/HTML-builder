const { readdir, stat } = require('fs/promises');
const path = require('path');


(async () => {
  try {
    const content = await readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });
    const files = content.filter(item => item.isFile());
    files.forEach(async item => {
      const pathOfFile = path.join(path.join(__dirname, 'secret-folder'), item.name);
      const stats = await stat(pathOfFile);
      const { name, ext } = path.parse(pathOfFile);
      console.log(`${name} - ${ext.slice(1)} - ${stats.size}b`);
    });
  } catch (error) {
    process.stderr.write('Error: ' + error.message);
    process.exit(1);
  }
})();