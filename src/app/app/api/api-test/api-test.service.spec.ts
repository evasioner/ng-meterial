import { TestBed } from '@angular/core/testing';

import { ApiTestService } from './api-test.service';

describe('ApiTestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiTestService = TestBed.get(ApiTestService);
    expect(service).toBeTruthy();
  });
});
