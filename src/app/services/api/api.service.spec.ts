import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.get(ApiService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([ApiService], (service: ApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should retrieve data from api via GET', () => {
    const dummyData = {
      "success":true,
      "message":"",
      "result":{
        "buy":[{"Quantity":0.07946808,"Rate":0.08090000},{"Quantity":0.20000000,"Rate":0.08081009}],
        "sell":[{"Quantity":39.64087785,"Rate":0.08100000},{"Quantity":48.57370019,"Rate":0.08110000}]
      }
    };

    service.getData('/api/bittrex/btc/eth').subscribe(data => {
      expect(data.success).toBeTruthy();
      expect(data.result.buy.length).toBe(2);
      expect(data.result.sell.length).toBe(2);
      expect(data).toEqual(dummyData);
    });

    const request = httpMock.expectOne('/api/bittrex/btc/eth');

    expect(request.request.method).toBe('GET');

    request.flush(dummyData);
  })
});
