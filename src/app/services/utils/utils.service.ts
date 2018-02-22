import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }

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
          return false;
        }
      }
    }
    return true;
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

  gdaxMap(arr) {
    return {
      quantity: parseFloat(arr[1]),
      rate: parseFloat(arr[0]),
      origin: 'gdax'
    };
  }

  cryptopiaMap(item) {
    return {
      quantity: item.Volume,
      rate: item.Price,
      origin: 'cryptopia'
    };
  }

}
