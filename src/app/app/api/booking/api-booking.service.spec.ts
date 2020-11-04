import { TestBed } from '@angular/core/testing';

import { ApiBookingService } from './api-booking.service';

describe('ApiBookingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiBookingService = TestBed.get(ApiBookingService);
    expect(service).toBeTruthy();
  });
});
