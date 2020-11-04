import { TestBed } from '@angular/core/testing';

import { AirtelSearchRoomtypePageService } from './airtel-search-roomtype-page.service';

describe('AirtelSearchRoomtypePageService', () => {
  let service: AirtelSearchRoomtypePageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirtelSearchRoomtypePageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
