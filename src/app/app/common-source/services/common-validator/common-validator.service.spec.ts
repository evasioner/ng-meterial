import { TestBed } from '@angular/core/testing';

import { CommonValidatorService } from './common-validator.service';

describe('CommonValidatorService', () => {
  let service: CommonValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
