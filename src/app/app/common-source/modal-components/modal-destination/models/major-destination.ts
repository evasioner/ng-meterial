export interface Item {
    destinationTypeCode: any;
    destinationCode: any;
    destinationNameEn: any;
    destinationNameLn: any;
    countryCode: any;
    countryNameEn: any;
    countryNameLn: any;
    cabinClassCode: any;
}

export interface List {
    groupSeq?: any;
    groupName?: any;
    items?: Item[];
}

export interface MajorDestination {
    compCode?: any;
    compName?: any;
    itemCategoryCode?: any;
    itemCategoryName?: any;
    list?: List[];
}
