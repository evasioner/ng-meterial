import { TestBed } from '@angular/core/testing';

import { ApiHotelService } from './api-hotel.service';

describe('ApiHotelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiHotelService = TestBed.get(ApiHotelService);
    expect(service).toBeTruthy();
  });
});
