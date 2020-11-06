/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InicisPaymentService } from './inicis-payment.service';

describe('Service: InicisPayment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InicisPaymentService]
    });
  });

  it('should ...', inject([InicisPaymentService], (service: InicisPaymentService) => {
    expect(service).toBeTruthy();
  }));
});
