import { TestBed } from '@angular/core/testing';

import { ActivityComServiceService } from './activity-com-service.service';

describe('ActivityComServiceService', () => {
  let service: ActivityComServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityComServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
