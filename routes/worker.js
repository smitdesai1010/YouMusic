const { parentPort } = require('worker_threads');
const { Response } = require('node-fetch');
const ytdl = require('ytdl-core')


parentPort.on('message', (data) => {
    const id = data.id;
    const startRange = data.start
    const endRange = data.end
    
    const stream = ytdl('https://www.youtube.com/watch?v='+id, {
                filter: 'audioonly',
                quality: 'lowestaudio',
                range: {start: startRange, end: endRange}
            })
    
    new Response(stream).buffer()
    .then(buffer => {
        parentPort.postMessage(buffer);
    })

});