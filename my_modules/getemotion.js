const vision = require('@google-cloud/vision');
const fs = require('fs');

const emotion = async function (req) {
    const client = new vision.ImageAnnotatorClient({
        keyFilename: __dirname + '/Key/FaceDetection.json'
    });

    const file = fs.createWriteStream(__dirname + '/image.jpg');

    req.pipe(file);

    const fileName = __dirname + '/image.jpg';

    let result;

    try 
    {
        [result] = await client.faceDetection(fileName)
                        .catch(err => {
                            console.error('Error in promise by google vision'+err);
                        });
    } 
    catch (error) 
    {
        console.error('Error in prcoessing the image by google vision'+error);
    }
   

    if (result == undefined) 
        return "no face detected";

    const faces = result.faceAnnotations;
    const likelihood = {
        "UNKNOWN": 0, 
        "VERY_UNLIKELY": 1,
        "UNLIKELY": 2,
        "POSSIBLE": 3, 
        "LIKELY": 4, 
        "VERY_LIKELY": 5
    }

    let maxvalueOfemotion = 0;
    let emotion = "happy";

    if (faces.length == 0)
        return "no face detected";

    if (likelihood[faces[0].joyLikelihood] > maxvalueOfemotion)
    {
        maxvalueOfemotion = likelihood[faces[0].joyLikelihood];
        emotion = "happy";
    }

    if (likelihood[faces[0].angerLikelihood] > maxvalueOfemotion)
    {
        maxvalueOfemotion = likelihood[faces[0].angerLikelihood];
        emotion = "angry";
    }

    if (likelihood[faces[0].sorrowLikelihood] > maxvalueOfemotion)
    {
        maxvalueOfemotion = likelihood[faces[0].sorrowLikelihood];
        emotion = "sad";
    }

    if (likelihood[faces[0].surpriseLikelihood] > maxvalueOfemotion)
    {
        maxvalueOfemotion = likelihood[faces[0].surpriseLikelihood];
        emotion = "suprised";
    }

    return emotion;
}

exports.emotion = emotion;