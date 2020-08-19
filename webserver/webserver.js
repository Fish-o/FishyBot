var http = require('http');
var fs = require('fs');
var index = fs.readFileSync(__dirname+'/index.html');

module.exports = {
    run: function (){
        http.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(index);
            res.end();
        }).listen(80); 
    }
};