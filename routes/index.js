var ExifImage = require('exif').ExifImage,
  when = require('when');

exports.index = function(req, res){
  res.send('Please, navigate to <a href="/index.html">index.html</a> page');
};

exports.getCoords = function(req, res) {
  var imgFile = 'test.jpg';

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
