import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { timer } from 'rxjs/observable/timer';
import { ApiService } from './../../services/api/api.service';
import { UtilsService } from './../../services/utils/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  market1 = 'btc';
  market2 = 'eth';

  bidsBittrex: Array<any>;
  asksBittrex: Array<any>
  bidsPoloniex: Array<any>;
  asksPoloniex: Array<any>;
  bidsGemini: Array<any>;
  asksGemini: Array<any>;

  bidsCombined = 0;
  asksCombined = 0;

  bids: Array<any>;
  asks: Array<any>;

  fixed = 8;
  apiTimer: Observable<any>;
  timerInterval = 5000;
  apis: any;

  bittrex: Observable<any>;
  poloniex: Observable<any>;
  gemini: Observable<any>;

  live = true;

  constructor(
    private apiService: ApiService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {


    this.bittrex = this.apiService.getData('/api/bittrex/' + this.market1 + '/' + this.market2);
    this.poloniex = this.apiService.getData('/api/poloniex/' + this.market1 + '/' + this.market2);
    // this.gemini = this.apiService.getData('/api/gemini/' + this.market1 + '/' + this.market2);
    this.subscribeToMarkets();

  }

  updateMarkets() {
    console.log(this.market2);
    this.unsubscribe();
    this.bittrex = this.apiService.getData('/api/bittrex/' + this.market1 + '/' + this.market2);
    this.poloniex = this.apiService.getData('/api/poloniex/' + this.market1 + '/' + this.market2);
    // this.gemini = this.apiService.getData('/api/gemini/' + this.market1 + '/' + this.market2);
    this.subscribeToMarkets();
  }

  subscribeToMarkets() {
    this.apiTimer = timer(0, this.timerInterval);
    this.apiTimer.subscribe(() => {
      this.apis = forkJoin([this.bittrex, this.poloniex]);
      this.apis
      .subscribe(results => {
        // normalize api responses
        this.bidsBittrex = results[0].result.buy.map(this.bittrexMap);
        this.asksBittrex = results[0].result.sell.map(this.bittrexMap);
        this.bidsPoloniex = results[1].bids.map(this.poloniexMap);
        this.asksPoloniex = results[1].asks.map(this.poloniexMap);
        // console.log(results[2]);
        // this.bidsGemini = results[2].bids.map(this.geminiMap);
        // this.asksGemini = results[2].asks.map(this.geminiMap);

        // sort merged json
        this.bids = this.utilsService.mergeSort(this.bidsBittrex.concat(this.bidsPoloniex));
        this.asks = this.utilsService.mergeSort(this.asksBittrex.concat(this.asksPoloniex));

        // combine and count overlapping bids & asks
        this.bidsCombined = this.utilsService.combine(this.bids, this.updateItem);
        this.asksCombined = this.utilsService.combine(this.asks, this.updateItem);

        // double check that all overlapping bids and asks were combined - needed?
        this.utilsService.checkCombine(this.bids);
        this.utilsService.checkCombine(this.asks);

        // some numbers are too long, need to trim them
        this.bids = this.bids.map(this.trimMap);
        this.asks = this.asks.map(this.trimMap);

        //TODO remove, debugging
        // console.log('bids(' + this.bidsCombined + ')', this.bids);
        // console.log('asks(' + this.asksCombined + ')', this.asks);
      });
    });
  }

  updateItem(item, nextItem) {
    if(item['overlap']) {
      item['original'].push({quantity: nextItem.quantity, origin: nextItem.origin});
    } else {
      item['original'] = [
        {quantity: item.quantity, origin: item.origin},
        {quantity: nextItem.quantity, origin: nextItem.origin}
      ];
    }
    item['overlap'] = true;
    item.origin = 'mixed';
    item.quantity += nextItem.quantity;

    return item;
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

  bittrexMap(item) {
    return {
      quantity: item.Quantity,
      rate: item.Rate,
      origin: 'bittrex'
    };
  }

  poloniexMap(arr) {
    return {
      quantity: arr[1],
      rate: parseFloat(arr[0]),
      origin: 'poloniex'
    };
  }

  geminiMap(item) {
    return {
      quantity: parseFloat(item.amount),
      rate: parseFloat(item.price),
      origin: 'gemini'
    };
  }

  unsubscribe() {
    // this.apiTimer.unsubscribe();
    // this.apis.unsubscribe();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
