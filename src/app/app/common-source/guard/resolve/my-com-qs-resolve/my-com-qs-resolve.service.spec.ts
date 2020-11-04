/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyComQsResolveService } from './my-com-qs-resolve.service';

describe('Service: MyComQsResolve', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyComQsResolveService]
    });
  });

  it('should ...', inject([MyComQsResolveService], (service: MyComQsResolveService) => {
    expect(service).toBeTruthy();
  }));
});
