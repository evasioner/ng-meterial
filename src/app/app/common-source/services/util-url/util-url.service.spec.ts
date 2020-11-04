import { TestBed } from '@angular/core/testing';

import { UtilUrlService } from './util-url.service';

describe('UtilUrlService', () => {
  let service: UtilUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
