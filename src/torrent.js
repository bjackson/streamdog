var readTorrent = require('read-torrent');
var peerflix = require('peerflix');
var internalIp = require('internal-ip');
var grabOpts = require('./grab-opts');

var port = 4102;

var torrent = function(path, cb) {
  if (!/^magnet:/.test(path)) throw path;

  readTorrent(path, function(err, torrent) {
    if (err) {
      throw err;
    }

    var engine = peerflix(torrent, grabOpts('', 'peerflix-'));
    var ip = internalIp();

    engine.server.once('listening', function() {
      console.log('started webserver on address %s using port %s', ip, engine.server.address().port);

      var media = {
        contentId: 'http://' + ip + ':' + engine.server.address().port,
        contentType: 'video/mp4',
        streamType: 'BUFFERED',
        metadata: {
          title: engine.server.index.name,
          type: 0,
          metadataType: 0
        }
      };

      cb(media);
    });
  });
};

module.exports = torrent;
