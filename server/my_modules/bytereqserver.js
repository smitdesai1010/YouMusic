//https://medium.com/@vishal1909/how-to-handle-partial-content-in-node-js-8b0a5aea216
const http = require("http");
const port = process.env.PORT || 4000;

const { stat, createReadStream } = require("fs");
const { promisify } = require("util");
const { pipeline } = require("stream");
const sampleVideo = "audio/a.mp3";
const fileInfo = promisify(stat);

http
  .createServer(async (req, res) => {

    const { size } = await fileInfo(sampleVideo);
    const range = req.headers.range;


    if (range) {

      let [start, end] = range.replace(/bytes=/, "").split("-");
      start = parseInt(start, 10);
      end = end ? parseInt(end, 10) : size - 1;

      if (!isNaN(start) && isNaN(end)) {
        start = start;
        end = size - 1;
      }
      if (isNaN(start) && !isNaN(end)) {
        start = size - end;
        end = size - 1;
      }


      if (start >= size || end >= size) {
        res.writeHead(416, {"Content-Range": `bytes */${size}`});
        return res.end();
      }

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": "audio/mp3"
      });

      let readable = createReadStream(sampleVideo, { start: start, end: end });
      pipeline(readable, res, err => console.log(err));

    } else {

      res.writeHead(200, {
        "Content-Length": size,
        "Content-Type": "audio/mp3"
      });

      let readable = createReadStream(sampleVideo);
      pipeline(readable, res, err => console.log(err));
    }
  })
  .listen(port, () => console.log("Running on 4000 port"));