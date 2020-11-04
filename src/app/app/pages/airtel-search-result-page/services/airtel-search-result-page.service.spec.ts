import { TestBed } from '@angular/core/testing';

import { AirtelSearchResultPageService } from './airtel-search-result-page.service';

describe('AirtelSearchResultPageService', () => {
  let service: AirtelSearchResultPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirtelSearchResultPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
