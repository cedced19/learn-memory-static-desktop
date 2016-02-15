$(function() {
    $.material.init();

    var fs = require('fs-extra'),
        path = require('path'),
        request = require('request'),
        isThere = require('is-there'),
        notie = require('notie'),
        dir = path.dirname(process.execPath) + '/generated';

    fs.mkdirsSync(dir);

    document.getElementById('#button').onclick = function () {
            var server = $('#server').val();
            var filename = $('#filename').val();
            var writeStream = fs.createWriteStream(dir + '/data.json');

            writeStream.on('error', function(err) {
              notie.alert(3, 'Error of writing.', 5);
            });

            writeStream.on('finish', function () {
              notie.alert(1, 'The data has been saved, upload the dist file to a http server.', 7);
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
                var readStream = fs.createReadStream(program.filename);

                readStream.on('open', function () {
                  readStream.pipe(writeStream);
                });

                readStream.on('error', function(err) {
                  notie.alert(3, 'Error of reading.', 5);
                });
            } else {
              notie.alert(3, 'Please set a server adress or a filename.', 5);
            }
    };
});
