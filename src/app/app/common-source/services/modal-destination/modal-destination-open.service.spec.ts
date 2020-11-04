import { TestBed } from '@angular/core/testing';

import { ModalDestinationOpenService } from './modal-destination-open.service';

describe('ModalDestinationOpenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModalDestinationOpenService = TestBed.get(ModalDestinationOpenService);
    expect(service).toBeTruthy();
  });
});
