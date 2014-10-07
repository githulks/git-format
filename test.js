describe('deformat', function () {
  'use strict';

  var deformat = require('./')
    , reformat = deformat.reformat
    , assume = require('assume')
    , s = deformat.separator;

  it('is exposed as a function', function () {
    assume(deformat).is.a('function');
  });

  it('exposes the separator', function () {
    assume(s).is.a('string');
  });

  it('exposed the reformatter function', function () {
    assume(reformat).is.a('function');
  });

  describe('.reformat', function () {
    it('adds separators around the placeholders', function () {
      var format = reformat('%H');

      assume(format).equals(s +'%H'+ s);
    });

    it('also replaces multiple placeholders', function () {
      var format = reformat('hello %H world %cr lulz');

      assume(format).equals([
        'hello ',
        '%H',
        ' world ',
        '%cr',
        ' lulz'
      ].join(s));
    });
  });
});
