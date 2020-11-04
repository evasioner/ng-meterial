import { Injectable } from '@angular/core';

import { ApiHotelService } from 'src/app/api/hotel/api-hotel.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

@Injectable({
    providedIn: 'root'
})
export class AirtelSearchRoomtypePageService {

    constructor(
        private apiHotelService: ApiHotelService,
        private alertService: ApiAlertService
    ) {
    }

    async getHotelInformation(contion: any) {
        console.info('[svc > svcTest]', contion);
        let data: any;
        await this.apiHotelService.POST_HOTEL_INFORMATION(contion)
            .toPromise()
            .then((res: any) => {
                console.info('[res]', res);
                if (res.succeedYn) {
                    data = res;
                    data.id = 'airtel-search-roomtype-page';
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
}
