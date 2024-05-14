const http = require("http");
const fs = require('fs').promises;

const host = 'localhost';
const port = 8000;


const requestListener = function (req, res) {
  var parsed=requestURL(req.url),
  file=parsed.file!='/'?parsed.file:'/index.html';
  fs.readFile(__dirname + file)
    .then(contents => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(contents);
      })
    .catch(err => {
        res.writeHead(404);
        res.end('Error: 404 - Not Found -- '+req.url);
        return;
      });
};


const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});


function requestURL(url){
  var res=url.split(/\?/);
  return {
    file:res[0],
    search:res[1],
  };
}
