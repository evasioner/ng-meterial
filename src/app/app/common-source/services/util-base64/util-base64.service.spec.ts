import { TestBed } from '@angular/core/testing';

import { UtilBase64Service } from './util-base64.service';

describe('UtilBase64Service', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: UtilBase64Service = TestBed.get(UtilBase64Service);
        expect(service).toBeTruthy();
    });
});
