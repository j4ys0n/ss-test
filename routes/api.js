var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/bittrex/btceth', function(req, res) {
  request('https://bittrex.com/api/v1.1/public/getorderbook?market=BTC-ETH&type=both').pipe(res);
});

router.get('/poloniex/btceth', function(req, res) {
  request('https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=100').pipe(res);
});

router.get('/gemini/btceth', function(req, res) {
  request('https://api.gemini.com/v1/book/ethbtc').pipe(res);
});

module.exports = router;
