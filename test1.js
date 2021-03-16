// test pedestrian detection from files

const pedestrianDetect = require('./pedestrian-detect');
const fs = require('fs');

const folder = 'images';

fs.readdir(folder, function (err, files) {
  const imgFiles = files.filter((f) => 'jpg jpeg png bmp'.includes(f.split('.')[1])); // only keep jpg jpeg png bmp file
  imgFiles.forEach(async function (file) {
    const imgBuf = fs.readFileSync(`${folder}/${file}`);
    const result = await pedestrianDetect.detect(imgBuf)
    fs.writeFileSync(`results/${file}`, result.img);
  });
})
