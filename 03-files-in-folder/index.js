const { readdir, stat } = require('fs/promises');
const path = require('path');


(async () => {
  try {
    const content = await readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });
    const files = content.filter(c => c.isFile());
    files.forEach(async f => {
      const filePath = path.join(path.join(__dirname, 'secret-folder'), f.name);
      const stats = await stat(filePath);
      const { name, ext } = path.parse(filePath);
      console.log(`${name} - ${ext.slice(1)} - ${stats.size}b`);
    });
  } catch (error) {
    process.stderr.write('Error: ' + error.message);
    process.exit(1);
  }
})();