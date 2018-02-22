export interface MergedDataOriginInterface {
  quantity: number;
  origin: string;
}

export interface NormalizedDataInterface {
  quantity: number;
  rate: number;
  origin: string;
  original?: Array<MergedDataOriginInterface>;
}

export interface BittrexMarketDataInterface {
  Quantity: number;
  Rate: number;
}

export interface BittrexInterface {
  message: string;
  result: {
    buy: Array<BittrexMarketDataInterface>;
    sell: Array<BittrexMarketDataInterface>;
  };
  success: boolean;
}

export interface PoloniexInterface {
  asks: Array<Array<string | number>>;
  bids: Array<Array<string | number>>;
  isFrozen: string;
  seq: number;
}

export interface GDAXInterface {
  asks: Array<Array<string | number>>;
  bids: Array<Array<string | number>>;
  sequence: number;
}

export interface CryptopiaMarketDataInterface {
  Label: string;
  Price: number;
  Total: number;
  TradePairId: number;
  Volume: number;
}

export interface CryptopiaInterface {
  Data: {
    Buy: Array<CryptopiaMarketDataInterface>;
    Sell: Array<CryptopiaMarketDataInterface>;
  };
  Error: any;
  Message: any;
  Success: boolean;
}
