var wd = require('wd');
require('colors');
var _ = require("lodash");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

// checking sauce credential
if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
  console.warn(
    '\nPlease configure your sauce credential:\n\n' +
    'export SAUCE_USERNAME=nullsteph\n' +
    'export SAUCE_ACCESS_KEY=08e1537b-157a-4d1c-bbd3-eba594fcc7d6\n\n'
  );
  throw new Error("Missing sauce credentials");
}

// http configuration, not needed for simple runs
wd.configureHttp({
  timeout: 60000,
  retryDelay: 15000,
  retries: 5
});

var desired = JSON.parse(process.env.DESIRED || '{browserName: "chrome"}');
desired.name = 'example with ' + desired.browserName;
desired.tags = ['tutorial'];

describe('tutorial (' + desired.browserName + ')', function () {
  var browser;
  var allPassed = true;

  before(function (done) {
    var username = process.env.SAUCE_USERNAME;
    var accessKey = process.env.SAUCE_ACCESS_KEY;
    browser = wd.promiseChainRemote("localhost", 4444, username, accessKey);
    if (process.env.VERBOSE) {
      // optional logging
      browser.on('status', function (info) {
        console.log(info.cyan);
      });
      browser.on('command', function (meth, path, data) {
        console.log(' > ' + meth.yellow, path.grey, data || '');
      });
    }
    browser
      .init(desired)
      .nodeify(done);
  });

  afterEach(function (done) {
    allPassed = allPassed && (this.currentTest.state === 'passed');
    done();
  });

  after(function (done) {
    //browser
    //    .quit()
    //    .sauceJobStatus(allPassed)
    //    .nodeify(done);
  });
  /*
   * username
   * password
   * tagname login
   * */
  it("should get home page: arstechnica", function (done) {
    browser
      .get("http://arstechnica.com/")
      .title()
      .should.become("Ars Technica")
      .nodeify(done);
  });

  it('should log in', function (done) {
    browser.
      elementById('login').click().
      waitForElementByCss('#username').sendKeys('stephendev').
      waitForElementByCss('#password').sendKeys('woot-woot').
      elementByName('login').click().
      waitForElementByCss('.welcome').text().
      should.become('stephendev').
      nodeify(done);
  });
});
