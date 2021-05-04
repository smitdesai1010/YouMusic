const vision = require('@google-cloud/vision');
const fs = require('fs');

const emotion = async function (req) {
    const client = new vision.ImageAnnotatorClient({
        keyFilename: __dirname + '/Key/FaceDetection.json'
    });

    const file = fs.createWriteStream(__dirname + '/image.jpg');

    req.pipe(file);

    const fileName = __dirname + '/image.jpg';

    const [result] = await client.faceDetection(fileName);
    const faces = result.faceAnnotations;

    const likelihood = {
        "UNKNOWN": 0, 
        "VERY_UNLIKELY": 1,
        "UNLIKELY": 2,
        "POSSIBLE": 3, 
        "LIKELY": 4, 
       " VERY_LIKELY": 5
    }

    faces.forEach((face, i) => {
        console.log(`  Face #${i + 1}:`);
        console.log(`    Joy: ${likelihood[face.joyLikelihood]}`);
        console.log(`    Anger: ${likelihood[face.angerLikelihood]}`);
        console.log(`    Sorrow: ${likelihood[face.sorrowLikelihood]}`);
        console.log(`    Surprise: ${likelihood[face.surpriseLikelihood]}`);
        console.log(face);
    });

    console.log('done');
}

exports.emotion = emotion;