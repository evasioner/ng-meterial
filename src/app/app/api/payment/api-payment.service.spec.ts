import { TestBed } from '@angular/core/testing';

import { ApiPaymentService } from './api-payment.service';

describe('ApiPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiPaymentService = TestBed.get(ApiPaymentService);
    expect(service).toBeTruthy();
  });
});
