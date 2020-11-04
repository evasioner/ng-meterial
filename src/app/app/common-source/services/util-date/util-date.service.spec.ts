import { TestBed } from '@angular/core/testing';

import { UtilDateService } from './util-date.service';

describe('UtilDateService', () => {
  let service: UtilDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
