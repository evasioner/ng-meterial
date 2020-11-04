import { TestBed } from '@angular/core/testing';

import { CommonUserInfoService } from './common-user-info.service';

describe('CommonUserInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonUserInfoService = TestBed.get(CommonUserInfoService);
    expect(service).toBeTruthy();
  });
});
