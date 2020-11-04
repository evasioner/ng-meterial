import { TestBed } from '@angular/core/testing';

import { ApiRentService } from './api-rent.service';

describe('ApiRentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiRentService = TestBed.get(ApiRentService);
    expect(service).toBeTruthy();
  });
});
