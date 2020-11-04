import { TestBed } from '@angular/core/testing';

import { SeoCanonicalService } from './seo-canonical.service';

describe('SeoCanonicalService', () => {
  let service: SeoCanonicalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoCanonicalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
