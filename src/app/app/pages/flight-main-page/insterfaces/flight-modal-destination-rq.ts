export interface FlightModaldestinationRq {
    storeId: any;
    majorDestinationRq: {
        rq: {
            currency: any,
            language: any,
            stationTypeCode: any,
            condition: {
                itemCategoryCode: any,
                compCode: number
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
