var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var Buffer = require('buffer').Buffer;
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var map = require('event-stream').map;

var revPlugin = function revPlugin(params) {

    var defaultParams = {
        basePath: null,
        forceRelativePathForExtensions: ".css",
        regExp: /(?:href=|src=|url\()['|"]?([^\s>"']+?)\?rev=(@@@)['|"\)]/gi
    };
    params = extend({}, defaultParams, params);

    function extend(target) {
        var sources = [].slice.call(arguments, 1);
        sources.forEach(function (source) {
            for (var prop in source) {
                target[prop] = source[prop];
            }
        });
        return target;
    }

    return map(function (file, cb) {
        var contents;
        var lines;
        var i, length;
        var line;
        var groups;
        var dependencyPath;
        var data, hash, hashStr;
        var isForceRelativePathForFile = params.forceRelativePathForExtensions.indexOf(path.extname(file.path)) !== -1;

        if (!file) {
            throw new PluginError('gulp-rev-append', 'Missing file option for gulp-rev-append.');
        }

        if (!file.contents) {
            throw new PluginError('gulp-rev-append', 'Missing file.contents required for modifying files using gulp-rev-append.');
        }

        contents = file.contents.toString();
        lines = contents.split('\n');
        length = lines.length;

        for (i = 0; i < length; i++) {
            line = lines[i];

            while ((groups = params.regExp.exec(line)) !== null) {
                if (groups.length > 1) {
                    // are we an "absoulte path"? (e.g. /js/app.js)
                    var normPath = path.normalize(groups[1]);
                    if (normPath.indexOf(path.sep) === 0 || !isForceRelativePathForFile) { //we have absolute path
                        if (params.basePath !== null) {
                            dependencyPath = path.join(params.basePath, normPath);
                        } else {
                            dependencyPath = path.join(file.base, normPath);
                        }
                    } else {
                        dependencyPath = path.resolve(params.basePath || path.dirname(file.path), normPath);
                    }
    
                    try {
                        data = fs.readFileSync(dependencyPath);
                        hash = crypto.createHash('md5');
                        hash.update(data.toString(), 'utf8');
                        hashStr = hash.digest('hex');
                    } catch (e) {
                        gutil.log('Can\'t find file (' + dependencyPath + ') from line (' + line.trim() + '). Random string will be used.');
                        hashStr = Math.floor((Math.random() * 10000) + 1);
                    }
    
                    line = line.replace(groups[2], hashStr);
                }
            }

            lines[i] = line;
            params.regExp.lastIndex = 0;
        }

        file.contents = new Buffer(lines.join('\n'));
        cb(null, file);

    });

};

module.exports = revPlugin;
