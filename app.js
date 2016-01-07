var express = require('express');
var app = express();
var request = require('superagent');
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: [__dirname + '/views/partials'],
  helpers: {}
}));
app.set('view engine', 'handlebars');

var sassMiddleware = require('node-sass-middleware');
var path = require('path');
app.use(sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/prefix'
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/@dosomething/forge/dist')));

var fs = require('fs');
var scripts = fs.readdirSync(__dirname + '/public/js');

app.get('/', function(req, res) {
  res.render('home', {"scripts": scripts});
});

app.get('/q', function(req, res) {
  var url = req.query.url;
  request
    .get(url)
    .end(function(err, webpageData) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(webpageData.text);
    });
});

var server = app.listen(process.env.PORT || 3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});