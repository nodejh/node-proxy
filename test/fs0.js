const fs = require('fs');
// const data = fs.readFileSync('./data.txt', { encoding: 'utf8' });
// fs.writeFileSync('./dataCopy.txt', data);
// const readStream = fs.createReadStream('./data/data.dmg');
// const writeStream = fs.createWriteStream('./data/dataCopy.dmg');

const readStream = fs.createReadStream('./data.txt');
const writeStream = fs.createWriteStream('./data/dataCopy.txt');

readStream.on('data', (chunk) => {
  // console.log('----------------------------');
  // console.log('chunk: ', chunk);
  // console.log(chunk.length)
  // console.log(writeStream.write(chunk));
  if (writeStream.write(chunk) === false) {
    readStream.pause();
  }
});


writeStream.on('drain', () => {
  console.log('drain');
  readStream.resume();
});

readStream.on('end', () => {
  writeStream.end();
});