$(function() {
    $.material.init();

    var fs = require('fs-extra'),
        decompressZip = require('decompress-zip'),
        path = require('path'),
        request = require('request'),
        isThere = require('is-there'),
        notie = require('notie'),
        generatedDir = path.dirname(process.execPath) + '/generated',
        tmpDir = path.dirname(process.execPath) + '/generated/tmp';

    fs.mkdirsSync(tmpDir + '/uncompressed');
    
    var ressources = function (cb) {
      var writeStream = fs.createWriteStream(tmpDir + '/master.zip');
      request
        .get('https://codeload.github.com/cedced19/learn-memory-static/zip/master')
        .on('error', function(err) {
          cb(err);
        })
        .pipe(writeStream);

      writeStream.on('error', function(err) {
        notie.alert(3, 'Write error.', 5);
      });

      writeStream.on('finish', function () {
        var unzipper = new decompressZip(tmpDir + '/master.zip');
        unzipper.on('error', function (err) {
            cb(err);
        });
        unzipper.on('extract', function () {
          fs.copy(tmpDir + '/uncompressed/learn-memory-static-master/dist', generatedDir, function (err) {
            if (err) return cb(err);
            fs.removeSync(tmpDir);
            cb(null);
          });
        });
        unzipper.extract({path: tmpDir + '/uncompressed'});
      });
    };

    document.getElementById('#button').onclick = function () {
            var server = $('#server').val();
            var filename = $('#filename').val();
            var writeStream = fs.createWriteStream(generatedDir + '/data.json');

            writeStream.on('error', function(err) {
              notie.alert(3, 'Write error.', 5);
            });

            writeStream.on('finish', function () {
              notie.alert(4, 'Downloading ressources from Github...', 3);
              ressources(function (err) {
                if (err) return notie.alert(3, 'Download error.', 5);
                notie.alert(1, 'The data has been saved, upload the generated folder to a http server.', 7);
              });
            });

            if (server !== '') {
                var url = 'http://' + server;
                var matcher = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/; // check whether a string is a URL
                if (matcher.test(url)) {
                  request(url + '/api/long/')
                  .on('error', function(err) {
                     notie.alert(3, 'Error of the request.', 5);
                  })
                  .pipe(writeStream);
                } else {
                  notie.alert(3, 'This isn\'t a valid URL.', 5);
                }
            } else if (filename !== '') {
                if (!isThere(filename)) return notie.alert(3, 'This isn\'t a valid filename.', 5);
                var readStream = fs.createReadStream(filename);

                readStream.on('open', function () {
                  readStream.pipe(writeStream);
                });

                readStream.on('error', function(err) {
                  notie.alert(3, 'Read error.', 5);
                });
            } else {
              notie.alert(3, 'Please set a server adress or a filename.', 5);
            }
    };
});
