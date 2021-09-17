
import express from "express";


const app = express();
const router = express.Router();

const port = 4321;

interface GetVideoFromUrl {
    url: string;
    viewPort: {
        width: number;
        height: number;
    }
    output: string;
    fps: number;
    duration: number; //seconds
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Static route for videos ? serve videos to anywhere ?
app.use(express.static('videos'));

router.post('/getVideo', (request, response) => {
    
});


app.use('/', router);