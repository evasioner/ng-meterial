import { TestBed } from '@angular/core/testing';

import { AuthCheckService } from './auth-check.service';

describe('AuthCheckService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthCheckService = TestBed.get(AuthCheckService);
    expect(service).toBeTruthy();
  });
});
