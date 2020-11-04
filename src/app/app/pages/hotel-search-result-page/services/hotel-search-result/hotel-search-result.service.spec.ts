import { TestBed } from '@angular/core/testing';

import { HotelSearchResultService } from './hotel-search-result.service';

describe('HotelSearchResultService', () => {
  let service: HotelSearchResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelSearchResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
