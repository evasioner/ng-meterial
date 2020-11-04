import { TestBed } from '@angular/core/testing';

import { HotelSearchRoomtypeService } from './hotel-search-roomtype.service';

describe('HotelSearchRoomtypeService', () => {
  let service: HotelSearchRoomtypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelSearchRoomtypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
