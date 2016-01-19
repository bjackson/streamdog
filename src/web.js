var express = require('express');
var torrent = require('./torrent');
var app = express();

var bodyParser = require('body-parser');

module.exports = function (player) {
  app.use(bodyParser.json());

  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
  });

  app.post('/stream', function(req, res) {
    var link = req.body.link;
    console.log(link);

    torrent(link, function (media) {
      console.log('app "%s" launched, loading media %s ...', player.session.displayName, media.contentId);

      player.load(media, { autoplay: true }, function(err, status) {
        console.log('media loaded playerState=%s', status.playerState);
      });
    });
  });

  app.listen(3000, function () {
    console.log('Streamdog listening on port 3000');
  });
}
