var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/bittrex/:first/:second', function(req, res) {
  console.log('timestamp:', Date.now());
  var first = decodeURIComponent(req.params.first).toUpperCase();
  var second = decodeURIComponent(req.params.second).toUpperCase();
  var options = {
    url: 'https://bittrex.com/api/v1.1/public/getorderbook?market=' + first + '-' + second + '&type=both'
  }
  request(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      return body;
    } else {
      console.log(error);
      return {
        message: "error with bittrex api",
        result: {
          buy: [],
          sell: []
        },
        success: false
      };
    }
  })
  .pipe(res);
});

router.get('/poloniex/:first/:second', function(req, res) {
  var first = decodeURIComponent(req.params.first).toUpperCase();
  var second = decodeURIComponent(req.params.second).toUpperCase();
  var options = {
    url: 'https://poloniex.com/public?command=returnOrderBook&currencyPair=' + first + '_' + second + '&depth=100'
  };
  request(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      return body;
    } else {
      console.log(error);
      return {
        asks: [],
        bids: [],
        isFrozen: "maybe",
        seq: 0
      };
    }
  })
  .pipe(res);
});

router.get('/gemini/:first/:second', function(req, res) {
  //pairs are limited, not using this right now.
  var first = decodeURIComponent(req.params.first);
  var second = decodeURIComponent(req.params.second);
  var options = {
    url: 'https://api.gemini.com/v1/book/' + second + first
  };
  request(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      return body;
    } else {
      console.log(error);
      return {
        // put something here before enabling
      };
    }
  })
  .pipe(res);
});

router.get('/gdax/:first/:second', function(req, res) {
  var first = decodeURIComponent(req.params.first).toUpperCase();
  var second = decodeURIComponent(req.params.second).toUpperCase();
  //gdax api needs user-agent defined.
  var options = {
    url: 'https://api.gdax.com/products/' + second + '-' + first + '/book?level=2',
    headers: { 'User-Agent': 'Test Agent/0.0.1' }
  };
  request(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      return body;
    } else {
      console.log(error);
      return {
        asks: [],
        bids: [],
        sequence: 0
      };
    }
  })
  .pipe(res);
});

router.get('/cryptopia/:first/:second', function(req, res) {
  var first = decodeURIComponent(req.params.first).toUpperCase();
  var second = decodeURIComponent(req.params.second).toUpperCase();
  var options = {
    url: 'https://cryptopia.co.nz/api/GetMarketOrders/' + second + '_' + first
  }
  request(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      return body;
    } else {
      console.log(error);
      return {
        Data: {
          Buy: [],
          Sell: []
        },
        Error: "response error",
        Message: "response from back end not cryptopia",
        Success: false
      };
    }
  })
  .pipe(res);
});

module.exports = router;
