/* jshint node: true */
'use strict';

var ScalaCompiler = require('./lib/scala-compiler');

module.exports = {
  name: 'Ember CLI Scala Addon',

  included: function(app) {

    var plugin = {
      name: 'ember-cli-scala',
      ext: 'js',

      toTree: function(tree, inputPath, outputPath) {
        var options = {
          srcDir: inputPath,
          destDir: outputPath
        };
        return ScalaCompiler(tree, options);
      }
    };

    app.registry.add('js', plugin);
  }
};
