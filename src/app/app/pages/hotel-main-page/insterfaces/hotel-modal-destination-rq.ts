export interface HotelModaldestinationRq {
    storeId: any;
    majorDestinationRq: {
        rq: {
            currency: any,
            language: any,
            stationTypeCode: any,
            condition: {
                itemCategoryCode: any,
                compCode: any
            }
        }
    };
    destinationRq: {
        rq: {
            currency: any,
            language: any,
            stationTypeCode: any,
            condition: {
                itemCategoryCode: any,
                keyword: any
            }
        },
    };
}
