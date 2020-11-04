import { TestBed } from '@angular/core/testing';

import { ApiActivityService } from './api-activity.service';

describe('ApiActivityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiActivityService = TestBed.get(ApiActivityService);
    expect(service).toBeTruthy();
  });
});
