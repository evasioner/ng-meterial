import { Injectable } from '@angular/core';

import { ApiTestService } from '@/app/api/api-test/api-test.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

@Injectable({
    providedIn: 'root'
})
export class ApiTestMockService {

    constructor(
        private apiTestService: ApiTestService,
        private alertService: ApiAlertService
    ) {
    }

    async svcTest(context: any) {
        console.info('[svc > svcTest]', context);
        let data: any;
        await this.apiTestService.GET_TEST_MOCK()
            .toPromise()
            .then((res: any) => {
                console.info('[res]', res);

                if (res.succeedYn) {
                    data = res;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            }
            );
        return data;
    }

    svcTest2() {
        return this.apiTestService.GET_TEST_MOCK();
    }

}
