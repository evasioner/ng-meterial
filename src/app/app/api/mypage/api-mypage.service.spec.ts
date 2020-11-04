import { TestBed } from '@angular/core/testing';

import { ApiMypageService } from './api-mypage.service';

describe('ApiMypageService', () => {
  let service: ApiMypageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiMypageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
