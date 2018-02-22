import { TestBed, inject } from '@angular/core/testing';

import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  const dummyOne = {
    "success":true,
    "message":"",
    "result":{
      "buy":[{"Quantity":0.07946808,"Rate":0.08090000},{"Quantity":0.20000000,"Rate":0.08081009}],
      "sell":[{"Quantity":39.64087785,"Rate":0.08100000},{"Quantity":48.57370019,"Rate":0.08110000}]
    }
  };
  const dummyTwo = {
    "asks":[["0.08087987",29.18880849],["0.08087988",6.7876898]],
    "bids":[["0.08075814",4.5101879],["0.08075811",2.53013228]]
  };
  const dummyThree = {
    "sequence":922861260,
    "bids":[["0.08091","0.00799257",1],["0.08088","0.1",1]],
    "asks":[["0.08092","44.47241098",13],["0.08094","37.688",1]]
  };
  const dummyFour = {
    "Success":true,
    "Message":null,
    "Data":{
      "Buy":[
        {"TradePairId":5203,"Label":"ETH/BTC","Price":0.08083252,"Volume":0.00564152,"Total":0.00045602},
        {"TradePairId":5203,"Label":"ETH/BTC","Price":0.08076556,"Volume":0.12381492,"Total":0.00999998}
      ],
      "Sell":[
        {"TradePairId":5203,"Label":"ETH/BTC","Price":0.08096643,"Volume":0.04903427,"Total":0.00397013},
        {"TradePairId":5203,"Label":"ETH/BTC","Price":0.08106687,"Volume":0.22896573,"Total":0.01856154}
      ]
    }
  };


  const dummyOneBidsNormalized = [
    {"quantity":0.07946808,"rate":0.0809,"origin":"bittrex"},
    {"quantity":0.2,"rate":0.08081009,"origin":"bittrex"}
  ];
  const dummyTwoBidsNormalized = [
    {"quantity":4.5101879,"rate":0.08075814,"origin":"poloniex"},
    {"quantity":2.53013228,"rate":0.08075811,"origin":"poloniex"}
  ];
  const dummyThreeBidsNormalized = [
    {"quantity":0.00799257,"rate":0.08091,"origin":"gdax"},
    {"quantity":0.1,"rate":0.08088,"origin":"gdax"}
  ];
  const dummyFourBidsNormalized = [
    {"quantity":0.00564152,"rate":0.08083252,"origin":"cryptopia"},
    {"quantity":0.12381492,"rate":0.08076556,"origin":"cryptopia"}
  ];
  const dummyOneAsksNormalized = [
    {"quantity":39.64087785,"rate":0.081,"origin":"bittrex"},
    {"quantity":48.57370019,"rate":0.0811,"origin":"bittrex"}
  ];
  const dummyTwoAsksNormalized = [
    {"quantity":29.18880849,"rate":0.08087987,"origin":"poloniex"},
    {"quantity":6.7876898,"rate":0.08087988,"origin":"poloniex"}
  ];
  const dummyThreeAsksNormalized = [
    {"quantity":44.47241098,"rate":0.08092,"origin":"gdax"},
    {"quantity":37.688,"rate":0.08094,"origin":"gdax"}
  ];
  const dummyFourAsksNormalized = [
    {"quantity":0.04903427,"rate":0.08096643,"origin":"cryptopia"},
    {"quantity":0.22896573,"rate":0.08106687,"origin":"cryptopia"}
  ];


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilsService]
    });
  });

  it('should be created', inject([UtilsService], (service: UtilsService) => {
    expect(service).toBeTruthy();
  }));

  it('should normalize, merge and sort data', inject([UtilsService], (service: UtilsService) => {
    //tests
    //normalize
    const bidsOne = dummyOne.result.buy.map(service.bittrexMap);
    const asksOne = dummyOne.result.sell.map(service.bittrexMap);
    const bidsTwo = dummyTwo.bids.map(service.poloniexMap);
    const asksTwo = dummyTwo.asks.map(service.poloniexMap);
    const bidsThree = dummyThree.bids.map(service.gdaxMap);
    const asksThree = dummyThree.asks.map(service.gdaxMap);
    const bidsFour = dummyFour.Data.Buy.map(service.cryptopiaMap);
    const asksFour = dummyFour.Data.Sell.map(service.cryptopiaMap);

    //merge and sort
    const bids = service.mergeSort(
      bidsOne
      .concat(bidsTwo)
      .concat(bidsThree)
      .concat(bidsFour)
    );
    const asks = service.mergeSort(
      asksOne
      .concat(asksTwo)
      .concat(asksThree)
      .concat(asksFour)
    );

    //add overlapping bids
    const bidsCombined = service.combine(bids);
    const asksCombined = service.combine(asks);

    //tests
    expect(bidsOne).toEqual(dummyOneBidsNormalized);
    expect(bidsTwo).toEqual(dummyTwoBidsNormalized);
    expect(bidsThree).toEqual(dummyThreeBidsNormalized);
    expect(bidsFour).toEqual(dummyFourBidsNormalized);
    expect(asksOne).toEqual(dummyOneAsksNormalized);
    expect(asksTwo).toEqual(dummyTwoAsksNormalized);
    expect(asksThree).toEqual(dummyThreeAsksNormalized);
    expect(asksFour).toEqual(dummyFourAsksNormalized);

    expect(bids).not.toEqual(bidsOne
    .concat(bidsTwo)
    .concat(bidsThree)
    .concat(bidsFour));
    expect(asks).not.toEqual(asksOne
    .concat(asksTwo)
    .concat(asksThree)
    .concat(asksFour));

    expect(service.checkCombine(bidsCombined)).toBeTruthy();
    expect(service.checkCombine(asksCombined)).toBeTruthy();

  }));
});
