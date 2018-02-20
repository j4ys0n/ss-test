var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/bittrex/:first/:second', function(req, res) {
  console.log('timestamp:', Date.now());
  var first = decodeURIComponent(req.params.first).toUpperCase();
  var second = decodeURIComponent(req.params.second).toUpperCase();
  request('https://bittrex.com/api/v1.1/public/getorderbook?market=' + first + '-' + second + '&type=both')
  .pipe(res);
});

router.get('/poloniex/:first/:second', function(req, res) {
  var first = decodeURIComponent(req.params.first).toUpperCase();
  var second = decodeURIComponent(req.params.second).toUpperCase();
  request('https://poloniex.com/public?command=returnOrderBook&currencyPair=' + first + '_' + second + '&depth=100')
  .pipe(res);
});

router.get('/gemini/:first/:second', function(req, res) {
  var first = decodeURIComponent(req.params.first);
  var second = decodeURIComponent(req.params.second);
  request('https://api.gemini.com/v1/book/' + second + first)
  .pipe(res);
});

module.exports = router;
