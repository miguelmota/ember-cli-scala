'use strict';

var fs = require('fs');
var path = require('path');
var Filter = require('broccoli-filter');
var shell = require('shelljs');
var rsvp = require('rsvp');
var ncp = require('ncp').ncp;

function ScalaCompiler(inputTree, options) {
  if (!(this instanceof ScalaCompiler)) {
    return new ScalaCompiler(inputTree, options);
  }
  Filter.call(this, inputTree, options);

  this.inputTree = inputTree;
  this.options = options || {};
}

ScalaCompiler.prototype = Object.create(Filter.prototype);
ScalaCompiler.prototype.constructor = ScalaCompiler;

ScalaCompiler.prototype.extensions = ['scala'];
ScalaCompiler.prototype.targetExtension = 'js';

function getPackageName(str) {
  var m = str.match(/package\s+([\w\d\.-_]+)/i);
  return m && m.length > 1 ? m[1] : null;
}

ScalaCompiler.prototype.processFile = function(srcDir, destDir, relativePath) {
  var deferred = rsvp.defer();

  var destFilePath = path.resolve(destDir + '/' + relativePath.split('/').slice(0,2).join('/'));
  var inputFiles = path.resolve(srcDir + '/' + relativePath.split('/').slice(0,2).join('/'));
  var inputFilesDest = path.resolve(destDir  + '/scala/src/main/scala/');
  var scalaBoilerplate = path.resolve(__dirname + '/../addon/scala');

  ncp(scalaBoilerplate, destDir + '/scala', function(err) {
    if (err) {
      deferred.reject(err);
      throw err;
    }

    ncp(inputFiles, inputFilesDest, function(err) {
      if (err) {
        deferred.reject(err);
        throw err;
      }

      var command = [
        'cd ' + destDir + '/scala &&',
        'sbt fullOptJS;'
      ].join(' ');

      shell.exec(command, {silent: false}, function(code, output) {
        if (code === 0) {
          var generatedJS = destDir + '/scala/target/scala-2.11/ember-cli-scala-addon-opt.js';

          fs.readdir(inputFilesDest, function(err, files) {
            if (err) {
              deferred.reject(err);
              throw err;
            }

            var filtered = files.filter(function(file) {
              return /\.scala$/.test(file);
            });

            var count = filtered.length;

            filtered.forEach(function(file) {
              fs.readFile(inputFilesDest + '/' + file, 'utf8', function(err, scalaFileData) {
                if (err) {
                  deferred.reject(err);
                  throw err;
                }

                var post = ';export default window.__ScalaJSExportsNamespace.' + getPackageName(scalaFileData);

                fs.readFile(generatedJS, 'utf8', function(err, JSFileData) {
                  if (err) {
                    deferred.reject(err);
                    throw err;
                  }

                  var data = JSFileData.replace(/\.call\(this\)/gi, '.call(window)');
                  data = data + post;
                  fs.writeFile(destFilePath + '/' + file.replace(/\.scala/, '.js'), data, function(err) {
                    if (err) {
                      deferred.reject(err);
                      throw err;
                    }
                    count--;
                    if (!count) {
                      deferred.resolve();
                    }
                  });
                });

              });
            });

          });

        } else {
          deferred.reject(output);
        }
      });
    });

  });

  return deferred.promise;
};

module.exports = ScalaCompiler;
