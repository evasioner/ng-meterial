import { TestBed } from '@angular/core/testing';

import { ApiTestMockService } from './api-test-mock.service';

describe('ApiTestMockService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiTestMockService = TestBed.get(ApiTestMockService);
    expect(service).toBeTruthy();
  });
});
