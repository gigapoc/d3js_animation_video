var page = require('webpage').create(),
  system = require('system'),
  t, address;

if (system.args.length === 1) {
  console.log('Usage: loadspeed.js [some URL]');
  phantom.exit();
}
t = Date.now();
address = system.args[1];

page.viewportSize = { width: 1920, height: 1080 };
page.clipReact = {top: 0, left: 0, width: 1920, height: 1080 };

var nb_seconds = 2; // Number of seconds the script will record svg.
var framerate = 60; // The number of svg per second the script will try to record.
var base_directory = "./images" // The directory where the svg files will be written.

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

page.open(address, function(status) {
  if (status !== 'success') {
    console.log('FAIL to load the address');
  } else {
    t = Date.now() - t;
    console.log('Loading ' + system.args[1]);
    console.log('Loading time ' + t + ' msec');


    page.evaluate(() => {
      var title = page.evaluate(function() {
        return document.title;
      });
    
      console.log(title);
      phantom.exit();
    })

    // Initial frame
    frame = 0;
    setInterval(function() {
        
        page.render(base_directory + "/image_" + pad(frame, 3) + ".png")

        if(frame >= nb_seconds*framerate)
        {
            phantom.exit();
        }
        frame++;
    }, 1000/framerate);
  }

  

});
