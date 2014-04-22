var ExifImage = require('exif').ExifImage,
  when = require('when'),
  fs = require('fs'),
  path = require('path'),
  im = require('imagemagick'),
  scanDir = require('fs-readdir-recursive'),
  _ = require('underscore');

exports.index = function(req, res){
  res.send('Please, navigate to <a href="/index.html">index.html</a> page');
};

exports.upload = function(req, res) {

  if (!!!req.files.image || !req.files.image.type.match(/image.*/)) {
    return res.json({
      status: false,
      message: 'incorrect file'
    });
  };

  fs.readFile(req.files.image.path, function(err, data) {
    var imageName = req.files.image.name,
        newPath,
        thumbPath;

    newPath = __dirname + "/../uploads/original/" + imageName;
    thumbPath = __dirname + "/../uploads/thumb/" + imageName;

    fs.writeFile(newPath, data, function(err) {
      im.resize({
        srcPath: newPath,
        dstPath: thumbPath,
        width:   150
      }, function(err, stdout, stderr){
        when(__getCoords(imageName)).then(function(data) {
          return res.json(data);
        });
      });
    });

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

exports.getData = function(req, res) {
  when(__getData()).then(function(data) {
    res.json( _.filter(data, function(item){
      return !!item.src;
    }));
  });
}



/* private functions */
__getData = function() {
  var deferred = when.defer();
  var fileList = scanDir(path.join(__dirname, '/../uploads/original')),
    deferreds = [];

  _.each(fileList, function(filename, index) {
    deferreds.push(__getCoords(filename));
  });

  when.all(deferreds).then(function(data) {
    deferred.resolve(data);
  });

  return deferred.promise;
}

function __getCoords(imgFile) {
  var deferred = when.defer(),
    filePath = 'uploads/original/' + imgFile,
    thumbPath = 'uploads/thumb/' + imgFile;

  new ExifImage({image : filePath}, function (error, exifData) {
    if (error) {

      fs.unlink(path.join(__dirname, '..', filePath), function(){});
      fs.unlink(path.join(__dirname, '..', thumbPath), function(){});

      deferred.resolve({
        status: false,
        message: 'no geo data'
      });
    } else {
      deferred.resolve(_.extend(calculate(exifData.gps), {
        filename: imgFile,
        src: thumbPath
      }));
    }
  });

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
