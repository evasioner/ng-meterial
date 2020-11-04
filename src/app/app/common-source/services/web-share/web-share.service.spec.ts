/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WebShareService } from './web-share.service';

describe('Service: WebShare', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebShareService]
    });
  });

  it('should ...', inject([WebShareService], (service: WebShareService) => {
    expect(service).toBeTruthy();
  }));
});
