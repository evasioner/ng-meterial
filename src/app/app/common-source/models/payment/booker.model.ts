export interface Booker {
    userNo: number;
    name: string;
    email: string;
    mobileNo: string;
    picUno: number;
}

export interface Travelers {
    travelerIndex: number;
    name: string;
    gender: string;
    ageTypeCode: string;
    nationalityCode: string;

    userNo?: number;
    bookingTravelerCode?: string;
    lastNameLn?: string;
    firstNameLn?: string;
    lastName?: string;
    middleName?: string;
    firstName?: string;
    // 생일
    birthday: string;
    //
    issueCountryCode: string;
    // 여권 번호
    passportNo?: string;
    // 뭐지?
    expireDate?: string;
    // 국내선만, 해당하는 경우에만 조립
    domesticFareCode?: string;
    // BTMS만 해당
    policyAppliedTravelerYn?: boolean;
}
