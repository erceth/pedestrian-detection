# Pedestrian Detection for Node

Uses opencv4nodejs to do pedestrian detection. Detector is already configured with default parameters so you can just call `detect` and pass in the image you want detected as a buffer array. If you know what you are doing you can change the parameters of detect by passing parameters into `optionalInit` once before calling `detect`.

See `test1.js` and `test2.js` as examples.

test1.js uses images from the `images` folder and sends each one through the detect algorithm and saves the results in the results folder.

test2.js get an image from a camera and send that image through the detect algorithm and saves the results in the results folder. test2.js gets its camera configuration from cam-config.json. Copy file cam-config-placeholder.json, rename it to cam-config.json and put your camera details in it.

## config
This module depends on the module opencv4nodejs. Add the opencv4nodejs configuration to your package.json:
```
}
  "name": "your app",
  ...
  "opencv4nodejs": {
    "autoBuildFlags": "-DBUILD_LIST=core,highgui,imgcodecs,objdetect,video,videoio",
    "autoBuildOpencvVersion": "4.3.0"
  }
}
```
This configuration tells opencv4nodejs to only include these openCV modules. By default it installs much more. It also tells opencv4nodejs to install openCV version 4.3.0.

If the opencv4nodejs auto build script does not work, perhaps a manual install of openCV would work better. See instructions [here](https://github.com/justadudewhohacks/opencv4nodejs#how-to-install).

## passing options
Pass options to `optionalInit` function once before calling `detect`.
```
const fullyLoadedOptions = {
  rectColor: { // red, green, blue
    r: 255,
    g: 255,
    b: 0
  },
  rectLineThickness: 2, // pixels,
  rectLineType: require('opencv4nodejs').LINE_8,
  outputFileType: '.jpg',
  winStride: {
    width: 4,
    height: 4
  },
  padding: {
    width: 8,
    height: 8
  },
  scale: 1.05,
  overlapThresh: .65,
};

pedestrianDetect.optionalInit(fullyLoadedOptions);
...
const result = pedestrianDetect.detect(image);
...
```
See test2.js for a simple example of passing options.

## results
The detect function returns a object
```
{
  img: <image>, // the image, with rectangles of anything detected.
  time: <number>, // milliseconds of how long the detection took. Useful in tuning performance.
  found: <number> // number of pedestrians detected. Matches the number of rectangles on img.
}
```

## rectangle only mode
Outputs a png image that is the same dimensions as input image and is entirely transparent except for where rectangles are drawn.
```
const rectangleOnlyOptions = {
  rectanglesOnly: true,
  rectanglesOnlyBorder: [0, 255, 255] // when bitwiseNot, this is blue
};
pedestrianDetect.optionalInit(rectangleOnlyOptions);
```

## other
Inspired by https://www.pyimagesearch.com/2015/11/09/pedestrian-detection-opencv/
pedestrian-detect.js is based on pedestrian-detect.py
