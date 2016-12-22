'use strict';

var chai = require('chai');
var expect = chai.expect;
var File = require('gulp-util').File;
var Buffer = require('buffer').Buffer;

var myStepDefinitionsWrapper = function () {

    this.Given(/^I have declared css file content with rev=@@@ declared for each url\(\)$/, function (callback) {
        this.indexFile = new File({
            cwd: 'test/fixtures/',
            base: 'test/fixtures/static',
            path: 'test/fixtures/static/style/style-one.css',
            contents: new Buffer(this.cssFileContents('style/style-one'))
        });
        callback();
    });

};
module.exports = myStepDefinitionsWrapper;