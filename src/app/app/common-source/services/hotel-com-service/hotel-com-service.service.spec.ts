import { TestBed } from '@angular/core/testing';

import { HotelComService } from './hotel-com-service.service';

describe('HotelComServiceService', () => {
  let service: HotelComService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelComService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
