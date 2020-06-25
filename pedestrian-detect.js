/*
find new way to point to openCV
*/
// LEFT OFF: Create flags for options and create documentation on them. test on pi. publish on websites

// https://www.pyimagesearch.com/2015/11/16/hog-detectmultiscale-parameters-explained/
// LEFT OFF: clean up, pass in options, publish

const cv = require('opencv4nodejs');
const nms = require('@erceth/non-maximum-suppression');

const hog = new cv.HOGDescriptor();
hog.setSVMDetector(cv.HOGDescriptor.getDefaultPeopleDetector())

// defaults
let winStride = new cv.Size(4, 4);
let padding = new cv.Size(8, 8);
let scale = 1.05;
let resizeOutput = 400;
let overlapThresh = .65;
let rectColor = new cv.Vec(0, 255, 0); // blue, green, red
let rectLineThickness = 2;
let rectLineType = cv.LINE_8;
let outputFileType = '.jpg';

module.exports = {
  optionalInit: (opts) => {
    // override defaults
    winStride = opts.winStride ? new cv.Size(opts.winStride.width, opts.winStride.height) : winStride;
    padding = opts.padding ? new cv.Size(opts.padding.width, opts.padding.height) : padding;
    scale = opts.scale ? opts.scale : scale;
    resizeOutput = opts.resizeOutput ? opts.resizeOutput : resizeOutput;
    overlapThresh = opts.overlapThresh ? opts.overlapThresh : overlapThresh;
    rectColor = opts.rectColor ? new cv.Vec(opts.rectColor.b, opts.rectColor.g, opts.rectColor.r) : rectColor; // blue, green, red
    rectLineThickness = opts.rectLineThickness ? opts.rectLineThickness : rectLineThickness;
    rectLineType = opts.rectLineType ? opts.rectLineType : rectLineType;
  },
  detect: (img) => {
    let image = cv.imdecode(img);
    if (resizeOutput > 0) {
      image = image.resizeToMax(resizeOutput);
    }
    
    const start = process.hrtime();
    const { foundLocations, locationsWeights } = hog.detectMultiScale(image, 0, winStride, padding, scale);
    const end = process.hrtime(start);

    // apply non-maxima suppression
    const pick = nms(foundLocations, overlapThresh)

    if (pick) {
      for (let i = 0; i < pick.length; i++) {
        // draw the rect for the object
        const { x1, y1, width, height } = pick[i];
        image.drawRectangle(new cv.Rect(x1, y1, width, height), rectColor, rectLineThickness, rectLineType);
      }
    }
    // cv.imshow('pedestrian', image); // debugging
    // cv.waitKey();
    return {
      time: end,
      img: cv.imencode(outputFileType, image)
    };
  }
}
