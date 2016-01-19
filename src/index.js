var Client                = require('castv2-client').Client;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;
var mdns                  = require('mdns');


var web = require('./web');

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
      web(player);

      player.on('status', function(status) {
        console.log('status broadcast playerState=%s', status.playerState);
      });




    });

  });

  client.on('error', function(err) {
    console.log('Error: %s', err.message);
    client.close();
  });

}
