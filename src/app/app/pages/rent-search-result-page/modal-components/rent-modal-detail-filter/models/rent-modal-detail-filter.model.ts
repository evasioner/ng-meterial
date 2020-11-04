/**
 * VehicleVendorsCheckBoxParam
 * 차량 공급사 체크박스
 */
export interface VehicleVendorsCheckBoxParam {
    code: string;
    count: number;
    lowestAmount: number;
    name: string;
    checked: boolean;
}

/**
 * VehicleTypesCheckBoxParam
 * 차량등급 체크박스
 */
export interface VehicleTypesCheckBoxParam {
    code: string;
    count: number;
    lowestAmount: number;
    name: string;
}

/**
 * PassengerCountsCheckBoxParam
 * 허용 승객수 체크박스
 */
export interface PassengerCountsCheckBoxParam {
    count: number;
    passengerCount: number;
    checked: boolean;
}

/**
 * MileagesCheckBoxParam
 * 주행거리 체크박스
 */
export interface MileagesCheckBoxParam {
    code: string;
    count: number;
    name: string;
    checked: boolean;
}

/**
 * PickupLocationsCheckBoxParam
 * 픽업장소
 */
export interface PickupLocationsCheckBoxParam {
    code: string;
    count: number;
    lowestAmount: number;
    typeCode: string;
    typeName: string;
    checked: boolean;
}

