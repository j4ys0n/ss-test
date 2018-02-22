import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { timer } from 'rxjs/observable/timer';
import { ApiService } from './../../services/api/api.service';
import { UtilsService } from './../../services/utils/utils.service';
import {
  NormalizedDataInterface,
  BittrexInterface,
  PoloniexInterface,
  GDAXInterface,
  CryptopiaInterface
} from './../../interfaces/market-interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  market1 = 'btc';
  market2 = 'eth';

  enableBittrex = true;
  enablePoloniex = true;
  enableGDAX = true;
  enableCryptopia = false;

  bidsBittrex: Array<NormalizedDataInterface>;
  asksBittrex: Array<NormalizedDataInterface>
  bidsPoloniex: Array<NormalizedDataInterface>;
  asksPoloniex: Array<NormalizedDataInterface>;
  bidsGdax: Array<NormalizedDataInterface>;
  asksGdax: Array<NormalizedDataInterface>;
  bidsCrypt: Array<NormalizedDataInterface>;
  asksCrypt: Array<NormalizedDataInterface>;

  bidsCombined = 0;
  asksCombined = 0;

  bids: Array<NormalizedDataInterface>;
  asks: Array<NormalizedDataInterface>;

  fixed = 8;
  apiTimer: Observable<any>;
  apiTimerDisposeable: any;
  timerInterval = 5000;
  apis: any;
  apiDisposeable: any;

  bittrex: Observable<BittrexInterface>;
  poloniex: Observable<PoloniexInterface>;
  gdax: Observable<GDAXInterface>;
  cryptopia: Observable<CryptopiaInterface>;

  resultsCache: Array<any>;

  subscribed = false;

  constructor(
    private apiService: ApiService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.updateMarkets();
  }

  toggleBittrex() {
    this.enableBittrex = !this.enableBittrex;
    this.updateData(this.resultsCache);
  }

  togglePoloniex() {
    this.enablePoloniex = !this.enablePoloniex;
    this.updateData(this.resultsCache);
  }

  toggleGDAX() {
    this.enableGDAX = !this.enableGDAX;
    this.updateData(this.resultsCache);
  }

  toggleCryptopia() {
    this.enableCryptopia = !this.enableCryptopia;
    this.updateData(this.resultsCache);
  }

  updateMarkets() {
    if (this.subscribed) {
      this.unsubscribe();
    }

    this.bittrex = this.apiService.getData('/api/bittrex/' + this.market1 + '/' + this.market2);
    this.poloniex = this.apiService.getData('/api/poloniex/' + this.market1 + '/' + this.market2);
    this.gdax = this.apiService.getData('/api/gdax/' + this.market1 + '/' + this.market2);
    this.cryptopia = this.apiService.getData('/api/cryptopia/' + this.market1 + '/' + this.market2);
    this.subscribeToMarkets();
    this.subscribed = true;
  }

  updateData(results) {
    // normalize api responses
    this.bidsBittrex = this.enableBittrex ? results[0].result.buy.map(this.utilsService.bittrexMap) : [];
    this.asksBittrex = this.enableBittrex ? results[0].result.sell.map(this.utilsService.bittrexMap) : [];
    this.bidsPoloniex = this.enablePoloniex ? results[1].bids.map(this.utilsService.poloniexMap) : [];
    this.asksPoloniex = this.enablePoloniex ? results[1].asks.map(this.utilsService.poloniexMap) : [];
    this.bidsGdax = this.enableGDAX ? results[2].bids.map(this.utilsService.gdaxMap) : [];
    this.asksGdax = this.enableGDAX ? results[2].asks.map(this.utilsService.gdaxMap) : [];
    this.bidsCrypt = this.enableCryptopia ? results[3].Data.Buy.map(this.utilsService.cryptopiaMap) : [];
    this.asksCrypt = this.enableCryptopia ? results[3].Data.Sell.map(this.utilsService.cryptopiaMap) : [];

    // sort merged json
    this.bids = this.utilsService.mergeSort(
      this.bidsBittrex
      .concat(this.bidsPoloniex)
      .concat(this.bidsGdax)
      .concat(this.bidsCrypt));
    this.asks = this.utilsService.mergeSort(
      this.asksBittrex
      .concat(this.asksPoloniex)
      .concat(this.asksGdax)
      .concat(this.asksCrypt));

    // combine and count overlapping bids & asks
    this.bidsCombined = this.utilsService.combine(this.bids);
    this.asksCombined = this.utilsService.combine(this.asks);

    // double check that all overlapping bids and asks were combined - needed here?
    this.utilsService.checkCombine(this.bids);
    this.utilsService.checkCombine(this.asks);

    // some numbers are too long, need to trim them
    this.bids = this.bids.map(this.trimMap);
    this.asks = this.asks.map(this.trimMap);

    //TODO remove, debugging
    // console.log('bids(' + this.bidsCombined + ')', this.bids);
    // console.log('asks(' + this.asksCombined + ')', this.asks);
  }

  subscribeToMarkets() {
    this.apiTimer = timer(0, this.timerInterval);
    this.apiTimerDisposeable = this.apiTimer.subscribe(() => {
      this.apis = forkJoin([
        this.bittrex,
        this.poloniex,
        this.gdax,
        this.cryptopia]);
      this.apiDisposeable = this.apis.subscribe(results => {
        this.resultsCache = results;
        this.updateData(results);
      });
    });
  }

  trimMap(item) {
    if (item.quantity.toString().length > 10) {
      item.quantity = parseFloat(item.quantity.toString().substr(0,10));
      item['qTrimmed'] = true; // more for error checking than anything
    }
    if (item.rate.toString().length > 10) {
      item.rate = parseFloat(item.rate.toString().substr(0,10));
      item['rTrimmed'] = true; // more for error checking than anything
    }
    return item;
  }

  unsubscribe() {
    this.apiDisposeable.unsubscribe();
    this.apiTimerDisposeable.unsubscribe();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
