export interface MajorDestination {
    compCode: any;
    compName: any;
    itemCategoryCode: any;
    itemCategoryName: any;
    list: [
        {
            groupSeq: any;
            groupName: any;
            items: [
                {
                    destinationTypeCode: any;
                    destinationCode: any;
                    destinationNameEn: any;
                    destinationNameLn: any;
                    countryCode: any;
                    countryNameEn: any;
                    countryNameLn: any;
                    cabinClassCode: any;
                }
            ]
        }
    ];

}
