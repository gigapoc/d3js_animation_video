const timecut = require('timecut');

timecut({
    url: "http://localhost:5000",
    viewport: {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 2
    },
    output: "video.mp4",
    fps: 30,
    duration: 10
})
.then (() => console.log('Done !'))