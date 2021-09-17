const puppeteer = require('puppeteer');

var nb_seconds = 2; // Number of seconds the script will record svg.
var framerate = 60; // The number of svg per second the script will try to record.
var base_directory = "./images" // The directory where the svg files will be written.

function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

  
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file:///home/gigodporc/Dev/VizuAll/PulpIn/misc/d3js_animation_video/node/index.html');


//    page.on('load', async () => {
//        console.log('Loaded')
//        await browser.close()
//    })

    // await browser.close()

//   Initial frame
  frame = 0;
  let frames = []
  setInterval(async () => {
      if (frames.indexOf(frame) === -1) {
        await page.screenshot({path: base_directory + "/image_" + pad(frame, 3) + ".png", fullPage: true, })
        if(frame >= nb_seconds*framerate)
        {
            console.log('frames', frames)
  
              await browser.close();
        }
        
        frames.push(frame)
        frame++;
      }
      
      
  }, 1000/framerate);

  
})();