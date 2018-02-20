import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ApiService } from './../../services/api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    let bittrex = this.apiService.getData('/api/bittrex/btceth');
    let poloniex = this.apiService.getData('/api/poloniex/btceth');
    let gemini = this.apiService.getData('/api/gemini/btceth');

    forkJoin([bittrex, poloniex, gemini]).subscribe(results => {
      this.bidsBittrex = results[0].result.buy.map(this.bittrexMap);
      this.asksBittrex = results[0].result.sell.map(this.bittrexMap);
      this.bidsPoloniex = results[1].bids.map(this.poloniexMap);
      this.asksPoloniex = results[1].asks.map(this.poloniexMap);
      this.bidsGemini = results[2].bids.map(this.geminiMap);
      this.asksGemini = results[2].asks.map(this.geminiMap);

      this.bids = this.mergeSort(this.bidsBittrex.concat(this.bidsPoloniex).concat(this.bidsGemini));
      this.asks = this.mergeSort(this.asksBittrex.concat(this.asksPoloniex).concat(this.asksGemini));

      this.bidsCombined += this.combine(this.bids);
      this.asksCombined += this.combine(this.asks);

      this.checkCombine(this.bids); //TODO remove
      this.checkCombine(this.asks); //TODO remove

      this.bids = this.bids.map(this.trimMap);
      this.asks = this.asks.map(this.trimMap);
      console.log('bids(' + this.bidsCombined + ')', this.bids);
      console.log('asks(' + this.asksCombined + ')', this.asks);
    });

  }

  trimMap(item) {
    if (item.quantity.toString().length > 10) {
      item.quantity = parseFloat(item.quantity.toString().substr(0,10));
      item['qTrimmed'] = true;
    }
    if (item.rate.toString().length > 10) {
      item.rate = parseFloat(item.rate.toString().substr(0,10));
      item['rTrimmed'] = true;
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

  updateItem(item, nextItem) {
    if(item['overlap']) {
      item['original'].push({quantity: nextItem.quantity, origin: nextItem.origin});
      console.log('third');
    } else {
      item['original'] = [
        {quantity: item.quantity, origin: item.origin},
        {quantity: nextItem.quantity, origin: nextItem.origin}
      ]
    }
    item['overlap'] = true;
    item.origin = 'mixed';
    item.quantity += nextItem.quantity;

    return item;
  }

  combine(arr): number {
    let len = arr.length;
    let count = 0;
    for (let i = 0; i < len; i++) {
      if (i !== len - 1) {
        if (arr[i].rate === arr[i+1].rate) {
          arr[i] = this.updateItem(arr[i], arr[i+1]);
          arr.splice(i+1, 1);
          count++;
          i--; // stay in place, check next
        }
      }
      len = arr.length;
    }
    return count;
  }

  checkCombine(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      if (i !== len - 1) {
        if (arr[i].rate === arr[i+1].rate) {
          console.warn('MISSED', arr[i], arr[i+1]);
        }
      }
    }
  }

  merge(left, right, arr) {
  	let a=0;

  	while (left.length && right.length)
  		arr[a++] = right[0].rate < left[0].rate ? right.shift() : left.shift();

  	while (left.length) arr[a++]=left.shift();
  	while (right.length) arr[a++]=right.shift();

    return arr;
  }

  mSort(arr, tmp, l) {
  	if(l==1) return;

  	let m = Math.floor(l/2),
  		tmp_l = tmp.slice(0,m),
  		tmp_r = tmp.slice(m);

    this.mSort(tmp_l, arr.slice(0,m), m);
    this.mSort(tmp_r, arr.slice(m), l-m);

  	return this.merge(tmp_l, tmp_r, arr);
  }

  mergeSort(arr){
  	return this.mSort(arr, arr.slice(), arr.length);
  }

}
