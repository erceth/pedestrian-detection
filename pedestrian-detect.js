const cv = require('opencv4nodejs');
const nms = require('@erceth/non-maximum-suppression');

const hog = new cv.HOGDescriptor();
hog.setSVMDetector(cv.HOGDescriptor.getDefaultPeopleDetector())

// defaults
let hitThreshold = 0;
let winStride = new cv.Size(4, 4);
let padding = new cv.Size(8, 8);
let scale = 1.05;
let resizeOutput = 400;
let overlapThresh = .65;
let rectColor = new cv.Vec(0, 255, 0); // blue, green, red
let rectLineThickness = 2;
let rectLineType = cv.LINE_8;
let outputFileType = '.jpg';
let rectanglesOnly = false;
let rectanglesOnlyBorder = [255, 0, 255]; // when bitwiseNot, this is green

let originalWidth = resizeOutput;
module.exports = {
  optionalInit: (opts) => {
    // override defaults
    hitThreshold = opts.hitThreshold ? opts.hitThreshold : hitThreshold;
    winStride = opts.winStride ? new cv.Size(opts.winStride.width, opts.winStride.height) : winStride;
    padding = opts.padding ? new cv.Size(opts.padding.width, opts.padding.height) : padding;
    scale = opts.scale ? opts.scale : scale;
    resizeOutput = opts.resizeOutput ? opts.resizeOutput : resizeOutput;
    overlapThresh = opts.overlapThresh ? opts.overlapThresh : overlapThresh;
    rectColor = opts.rectColor ? new cv.Vec(opts.rectColor.b, opts.rectColor.g, opts.rectColor.r) : rectColor; // blue, green, red
    rectLineThickness = opts.rectLineThickness ? opts.rectLineThickness : rectLineThickness;
    rectLineType = opts.rectLineType ? opts.rectLineType : rectLineType;
    if (opts.rectanglesOnly) {
      rectanglesOnly = opts.rectanglesOnly;
      outputFileType = '.png';
      if (opts.rectanglesOnlyBorder &&  opts.rectanglesOnlyBorder.length === 3) {
        rectanglesOnlyBorder = opts.rectanglesOnlyBorder;
      }
      rectColor = new cv.Vec(rectanglesOnlyBorder[0], rectanglesOnlyBorder[1], rectanglesOnlyBorder[2]);
    }
  },
  detect: async (img) => {
    let image = cv.imdecode(img);
    if (resizeOutput > 0) {
      originalWidth = image.sizes[1];
      image = image.resizeToMax(resizeOutput);
    }
    
    const start = process.hrtime();
    const { foundLocations, locationsWeights } = await hog.detectMultiScaleAsync(image, hitThreshold, winStride, padding, scale);
    const end = process.hrtime(start);

    // apply non-maxima suppression
    const pick = nms(foundLocations, overlapThresh)
    if (rectanglesOnly) {
      image = new cv.Mat(image.sizes[0], image.sizes[1], cv.CV_8UC4, [0,0,0,255]);
    }
    if (pick) {
      for (let i = 0; i < pick.length; i++) {
        // draw the rect for the object
        const { x1, y1, width, height } = pick[i];
        image.drawRectangle(new cv.Rect(x1, y1, width, height), rectColor, rectLineThickness);
      }
      if (rectanglesOnly) {
        image = image.bitwiseNot();
      }
      if (resizeOutput > 0) {
        image = image.resizeToMax(originalWidth);
      }
    }
    // cv.imshow('pedestrian', image); // debugging
    // cv.waitKey();
    return {
      time: end,
      img: cv.imencode(outputFileType, image),
      found: pick.length
    };
  }
}
