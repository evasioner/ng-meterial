import { TestBed } from '@angular/core/testing';

import { ApiFlightService } from './api-flight.service';

describe('ApiFlightService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiFlightService = TestBed.get(ApiFlightService);
    expect(service).toBeTruthy();
  });
});
