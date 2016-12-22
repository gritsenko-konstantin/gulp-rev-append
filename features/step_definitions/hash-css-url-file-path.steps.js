'use strict';

var chai = require('chai');
var expect = chai.expect;
var File = require('gulp-util').File;
var Buffer = require('buffer').Buffer;

var myStepDefinitionsWrapper = function () {

    this.Given(/^I have declared dependencies in an css file using css url\(\) with revision tokens$/, function (callback) {
        this.indexFile = new File({
            cwd: 'test/fixtures/',
            base: 'test/fixtures/static',
            path: 'test/fixtures/static/style/style-one.css',
            contents: new Buffer(this.cssFileContents('style/style-one'))
        });
        callback();
    });

    this.Given(/^I have declared all possible combinations$/, function (callback) {
        this.testText = `body {
  font-size: 100%;
  background-image: url(../images/some_image.txt?rev=@@@);
}

span {
  font-size: 100%;
  background-image: url('../images/some_image.txt?rev=@@@');
}

div {
  font-size: 100%;
  background-image: url("../images/some_image.txt?rev=@@@");
}`;
        callback();
    });

    this.When(/^I invoke the regexp match$/, function (callback) {
        var fileDeclarationRegex = this.FILE_DECL;
        this.matches = this.testText.match(fileDeclarationRegex);
        callback();
    });

    this.Then(/^We have matched all combinations$/, function (callback) {
        expect(this.matches).to.not.be.null();
        expect(this.matches).to.have.property('length').to.be.equal(3);
        callback();
    });
};
module.exports = myStepDefinitionsWrapper;