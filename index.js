'use strict';

var fs = require('fs'),
  thunkify = require('thunkify'),
  readFile = thunkify(fs.readFile);

module.exports = combo;

function *combo(next) {
  var regex = /combo=[^&]*/,
    comboList = regex.exec(this.querystring);

  yield next;

  if (!comboList) {
    return;
  }
  comboList = comboList[0];
  comboList = comboList.slice(comboList.indexOf('=') + 1).split(/\s*,\s*/g);
  this.body = ''; 

  // Cannot use comboList.map here because
  // yield must be used inside generator functions.
  // But this is kind of a murdering functional 
  // programming goodness. Any thoughts?
  var i,
    len = comboList.length;
  for (i = 0; i < len; i ++) {
    try {
      var result = yield readFile(comboList[i]);
      this.body += result + '\n';
    }
    catch (e) {
      console.log('missing file: ' + comboList[i]);
    }
  };
}