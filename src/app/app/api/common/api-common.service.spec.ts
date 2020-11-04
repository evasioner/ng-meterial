import { TestBed } from '@angular/core/testing';

import { ApiCommonService } from './api-common.service';

describe('ApiCommonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiCommonService = TestBed.get(ApiCommonService);
    expect(service).toBeTruthy();
  });
});
