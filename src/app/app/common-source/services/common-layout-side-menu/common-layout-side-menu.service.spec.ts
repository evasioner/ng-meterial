import { TestBed } from '@angular/core/testing';

import { CommonLayoutSideMenuService } from './common-layout-side-menu.service';

describe('CommonLayoutSideMenuService', () => {
  let service: CommonLayoutSideMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonLayoutSideMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
