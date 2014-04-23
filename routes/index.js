var ExifImage = require('exif').ExifImage,
  when = require('when'),
  fs = require('fs'),
  path = require('path'),
  im = require('imagemagick'),
  scanDir = require('fs-readdir-recursive'),
  _ = require('underscore');


var THUMB_PATH = 'thumb/';
var ORIGIN_PATH = 'original/';
var UPLOAD_DIR = '../uploads/';



exports.uploadPhoto = function(req, res) {
  if (!!!req.files.image || !req.files.image.type.match(/image.*/)) {
    return res.json({
      status: false,
      message: 'incorrect file'
    });
  };

  fs.readFile(req.files.image.path, function(err, data) {
    var imageName = req.files.image.name,
      originFilePath = path.join(__dirname, UPLOAD_DIR, ORIGIN_PATH, imageName),
      thumbFilePath = path.join(__dirname, UPLOAD_DIR, THUMB_PATH, imageName)

    fs.writeFile(originFilePath, data, function(err) {
      im.resize({
        srcPath: originFilePath,
        dstPath: thumbFilePath,
        strip : false,
        width : 125,
        height : '125^',
        customArgs: [
          '-gravity', 'center',
          '-extent', '125x125'
        ]
      }, function(err, stdout, stderr){

        when(getFileDataByName(imageName)).then(function(data) {
          return res.json(data);
        });

      });
    });

  });
};

exports.getPhotos = function(req, res) {
  when(getPhotosData()).then(function(data) {
    res.json(data);
  });
}

exports.deletePhoto = function(req, res) {
  var imageName = req.params.imageName;

  if (!!imageName) {
    deleteFiles(imageName);
  }

  res.json({
    message: 'success'
  });
}

function deleteFiles(imageName) {
  var originFilePath = path.join(__dirname, UPLOAD_DIR, ORIGIN_PATH, imageName),
    thumbFilePath = path.join(__dirname, UPLOAD_DIR, THUMB_PATH, imageName);

  fs.unlink(originFilePath, function() {});
  fs.unlink(thumbFilePath, function() {});
}

/* private functions */
function getPhotosData () {
  var fileList = scanDir(path.join(__dirname, UPLOAD_DIR, ORIGIN_PATH)),
    deferred = when.defer(),
    deferreds = [];

  _.each(fileList, function(imageName) {
    deferreds.push(getFileDataByName(imageName));
  });

  when.all(deferreds).then(function(data) {
    // return item with geo data
    var filteredData = _.filter(data, function(item) {
      return !!item.lat;
    });

    deferred.resolve(filteredData);
  });

  return deferred.promise;
}

function getFileDataByName(imageName) {
  var deferred = when.defer(),
    originFilePath = path.join(__dirname, UPLOAD_DIR, ORIGIN_PATH, imageName);

  new ExifImage({image : originFilePath}, function (error, exifData) {
    if (error) {

      deleteFiles(imageName);

      deferred.resolve({
        status: false,
        message: 'no geo data'
      });
    } else {
      deferred.resolve(_.extend(geoLocationParse(exifData.gps), {
        filename: imageName,
        src: path.join(THUMB_PATH, imageName)
      }));
    }
  });

  return deferred.promise;
}

function geoLocationParse(data) {
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

var cl = function(x) {
  console.log(x);
}
