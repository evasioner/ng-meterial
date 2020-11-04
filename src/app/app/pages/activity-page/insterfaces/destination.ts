export interface Destination {
    cities: [
        {
            cityCode: any;
            cityNameEn: any;
            cityNameLn: any;
            cityCodeIata: any;
            regionCode: any;
            regionNameEn: any;
            regionNameLn: any;
            stateCode: any;
            stateNameEn: any;
            stateNameLn: any;
            countryCode: any;
            countryNameEn: any;
            countryNameLn: any;
            airports: [
                {
                    airportCode: any;
                    airportNameEn: any;
                    airportNameLn: any;
                }
            ]
        }
    ];
    regions: [
        {
            regionCode: any;
            regionNameEn: any;
            regionNameLn: any;
            cityCode: any;
            cityCodeIata: any;
            stateCode: any;
            stateNameEn: any;
            stateNameLn: any;
            countryCode: any;
            countryNameEn: any;
            countryNameLn: any;
        }
    ];
    airports: [
        {
            airportCode: any;
            airportNameEn: any;
            airportNameLn: any;
            cityCode: any;
            cityNameEn: any;
            cityNameLn: any;
            cityCodeIata: any;
            regionCode: any;
            regionNameEn: any;
            regionNameLn: any;
            stateCode: any;
            stateNameEn: any;
            stateNameLn: any;
            countryCode: any;
            countryNameEn: any;
            countryNameLn: any;
        }
    ];
    pois: [
        {
            poiCode: any;
            poiName: any;
            poiNameEn: any;
            poiNameLn: any;
            cityCode: any;
            cityNameEn: any;
            cityNameLn: any;
            cityCodeIata: any;
            regionCode: any;
            regionNameEn: any;
            regionNameLn: any;
            stateCode: any;
            stateNameEn: any;
            stateNameLn: any;
            countryCode: any;
            countryNameEn: any;
            countryNameLn: any;
        }
    ];
    hotels: [
        {
            hotelCode: any;
            hotelNameEn: any;
            hotelNameLn: any;
            starRating: any;
            cityCode: any;
            cityNameEn: any;
            cityNameLn: any;
            cityCodeIata: any;
            regionCode: any;
            regionNameEn: any;
            regionNameLn: any;
            stateCode: any;
            stateNameEn: any;
            stateNameLn: any;
            countryCode: any;
            countryNameEn: any;
            countryNameLn: any;
        }
    ];
    branches: [
        {
            branchCode: any;
            branchNameEn: any;
            branchNameLn: any;
            cityCode: any;
            cityNameEn: any;
            cityNameLn: any;
            cityCodeIata: any;
            regionCode: any;
            regionNameEn: any;
            regionNameLn: any;
            stateCode: any;
            stateNameEn: any;
            stateNameLn: any;
            countryCode: any;
            countryNameEn: any;
            countryNameLn: any;
        }
    ];
    vehicles: [
        {
            vehicleVendorCode: any;
            vehicleVendorName: any;
            cityCode: any;
            cityNameEn: any;
            cityNameLn: any;
            cityCodeIata: any;
            regionCode: any;
            regionNameEn: any;
            regionNameLn: any;
            stateCode: any;
            stateNameEn: any;
            stateNameLn: any;
            countryCode: any;
            countryNameEn: any;
            countryNameLn: any;
            serviceTypes: [
                {
                    serviceCode: any;
                    serviceDetail: any;
                }
            ]
        }
    ];

}
