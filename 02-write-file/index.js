const { stdin, stdout } = process;
const path = require('path');
const fs = require('fs');

fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err) throw err;
});

stdout.write('Напишите что нибудь и я сохраню это..\n ');
stdin.on('data', (data) => {
  fs.appendFile(path.join(__dirname, 'text.txt'), data, (err) => {
    if (err) throw err;
  });

  const newData = data.toString().trim();
  if (newData === 'exit') {
    process.on('exit', () => stdout.write('Вы уже уходите ? До встречи!'));
    process.exit();
  }

  stdout.write(`Вы написали: ${data} Напишите что нибудь и я сохраню это тоже...\n`);

  process.on('SIGINT', () => {
    stdout.write('Вы уже уходите ? До встречи!');
    process.exit();
  });
});
