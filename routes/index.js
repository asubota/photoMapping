var ExifImage = require('exif').ExifImage,
  when = require('when'),
  fs = require('fs'),
  im = require('imagemagick');

exports.index = function(req, res){
  res.send('Please, navigate to <a href="/index.html">index.html</a> page');
};

exports.upload = function(req, res) {
  fs.readFile(req.files.image.path, function (err, data) {
    var imageName = req.files.image.name,
        newPath,
        thumbPath;

    if(!imageName){
      console.log("There was an error")
      res.redirect("/index.html");
      res.end();
    } else {
      newPath = __dirname + "/../uploads/original/" + imageName;
      thumbPath = __dirname + "/../uploads/thumb/" + imageName;

      fs.writeFile(newPath, data, function (err) {

        im.resize({
          srcPath: newPath,
          dstPath: thumbPath,
          width:   150
        }, function(err, stdout, stderr){
          if (err) {
            throw err;
          }
          console.log('resized image to fit within 200x200px');
        });

        res.send({
          original: "/uploads/original/" + imageName,
          thumb: "/uploads/thumb/" + imageName
        });
      });
    }
  });
};

exports.showFile = function(req, res) {
  var file = req.params.file,
    img = fs.readFileSync(__dirname + "/../uploads/original/" + file);

  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
};

exports.showThumb = function(req, res) {
  var file = req.params.file,
    img = fs.readFileSync(__dirname + "/../uploads/thumb/" + file);

  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
};

exports.getCoords = function(req, res) {
  var imgFile = 'uploads/original/test.jpg';

  __getCoords(imgFile).then(
    function(data) {
      res.send(data);
    },
    function(error) {
        console.log(error);
    }
  );
};

/* private functions */
function __getCoords(imgFile) {
    var deferred = when.defer();

    try {
        new ExifImage({image : imgFile}, function (error, exifData) {
            if (error) {
                deferred.reject(new Error(error.message));
            }
            else {
                deferred.resolve(calculate(exifData.gps));
            }
        });
    } catch (error) {
        deferred.reject(new Error(error.message));
    }

    function calculate(data) {
        var GPSLat = data.GPSLatitude,
            GPSLng = data.GPSLongitude,
            GPSLatRef = data.GPSLatitudeRef,
            GPSLngRef = data.GPSLongitudeRef,
            result = {};

        function parse(data) {
            return data[0] + data[1]/60 + data[2]/3600;
        }

        result.lat = parse(GPSLat);
        result.lng = parse(GPSLng);

        if (GPSLatRef.toLowerCase() === 's') {
            result.lat = -1 * result.lat;
        }

        if (GPSLngRef.toLowerCase() === 'w') {
            result.lng = -1 * result.lng;
        }

        return result;
    }

    return deferred.promise;
}
