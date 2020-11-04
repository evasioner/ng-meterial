import { TestBed } from '@angular/core/testing';

import { RentUtilService } from './rent-util.service';

describe('RentUtilService', () => {
  let service: RentUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
