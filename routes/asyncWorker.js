const { parentPort } = require('worker_threads');
const { Response } = require('node-fetch');
const ytdl = require('ytdl-core')

parentPort.on('message', (data) => {
    const id = data.id;
    const chunkSize = data.chunkSize;
    let numberOfChunks = data.numberOfChunks;
    let array = [];

    for (let i = 0; i < numberOfChunks; ++i) {

        let startRange = chunkSize * i;
        let endRange = chunkSize * (i+1) - 1;

        if (i == numberOfChunks - 1)        //last chunk
            endRange = null;    
            
        const stream = ytdl('https://www.youtube.com/watch?v='+id, {
            filter: 'audioonly',
            quality: 'highestaudio',
            range: {start: startRange, end: endRange}
          })

        new Response(stream).buffer()
        .then(buffer => {
            array[i] = buffer;     //store chunks in their respective positions
            --numberOfChunks;      //decrement to signal a chunk is processed

            if (numberOfChunks == 0) {     //all chunks are processed
                parentPort.postMessage(Buffer.concat(array))
            }
        })
        .catch(err => {
            console.log('Error in getting buffer\n'+ err);
            parentPort.postMessage(null);   //IF THIS OCCURS, REDO THE PROCESS FROM PARENT
            process.exit(0)
        })
    }
})