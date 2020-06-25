// get test from camera

const pedestrianDetect = require('./pedestrian-detect');
const request = require('request');
const fs = require('fs');

const camConfig = require('./cam-config.json');

const requestOptions = {
  auth: camConfig.auth,
  // encoding: 'binary', // TODO see if binary make a difference
  encoding: null
}

const pedOptions = {
  rectColor: {
    r: 255,
    g: 255,
    b: 0
  }, 
  outputFileType: '.jpg'
};

pedestrianDetect.optionalInit(pedOptions);

request.get(camConfig.url, requestOptions, (error, options, body) => {
  const result = pedestrianDetect.detect(body)
  console.log(result)
  fs.writeFileSync(`results/result${pedOptions.outputFileType}`, result.img);
  console.log(`check: ./result${pedOptions.outputFileType}`)
})
