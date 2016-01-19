var Client                = require('castv2-client').Client;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;
var mdns                  = require('mdns');

var torrent = require('./torrent');

var magnetLink = 'magnet:?xt=urn:btih:76baf98e3797c103eb02f668075ad047f10df130&dn=The.Man.from.U.N.C.L.E.2015.1080p.WEB-DL.x264.AC3-JYK&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337';

var browser = mdns.createBrowser(mdns.tcp('googlecast'));

browser.on('serviceUp', function(service) {
  console.log('found device "%s" at %s:%d', service.name, service.addresses[0], service.port);
  ondeviceup(service.addresses[0]);
  browser.stop();
});

browser.start();

function ondeviceup(host) {

  var client = new Client();

  client.connect(host, function() {
    console.log('connected, launching app ...');

    client.launch(DefaultMediaReceiver, function(err, player) {
      // var media = {
      //
      //   // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
      //   contentId: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4',
      //   contentType: 'video/mp4',
      //   streamType: 'BUFFERED', // or LIVE
      //
      //   // Title and cover displayed while buffering
      //   metadata: {
      //     type: 0,
      //     metadataType: 0,
      //     title: "Big Buck Bunny",
      //     images: [
      //       { url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg' }
      //     ]
      //   }
      // };
      //
      //

      player.on('status', function(status) {
        console.log('status broadcast playerState=%s', status.playerState);
      });

      torrent(magnetLink, function (media) {
        console.log('app "%s" launched, loading media %s ...', player.session.displayName, media.contentId);

        player.load(media, { autoplay: true }, function(err, status) {
          console.log('media loaded playerState=%s', status.playerState);
        });
      });


    });

  });

  client.on('error', function(err) {
    console.log('Error: %s', err.message);
    client.close();
  });

}
