/**
 * StarRatingCheckBoxParam
 * 호텔 성급 체크박스
 */
export interface StarRatingCheckBoxParam {
    starRating: string;
    count: number;
    lowestAmount: number;
    checked: boolean;
}

/**
 * HotelTypeCheckBoxParam
 * 숙소 유형 체크박스
 */
export interface HotelTypeCheckBoxParam {
    code: string;
    count: number;
    lowestAmount: number;
    name: string;
    checked: boolean;
}

/**
 * BreakfastCheckBoxParam
 * 조식 포함 체크박스
 */
export interface BreakfastCheckBoxParam {
    text: string;
    code: boolean;
    checked: boolean;
}

/**
 * BreakfastCheckBoxParamSet
 * 조식 포함 체크박스 기본값
 */
export const BreakfastCheckBoxParamSet: BreakfastCheckBoxParam[] = [
    { text: '포함', code: true, checked: false },
    { text: '미포함', code: false, checked: false }
];

/**
 * Attractions
 * 인근 지역
 */
export interface Attractions {
    checked: boolean;
}

/**
 * ChainsCheckBoxParam
 * 호텔 체인 체크박스
 */
export interface ChainsCheckBoxParam {
    brands: Array<any>;
    code: string;
    count: number;
    name: string;
    lowestAmount: number;
    checked: boolean;
}

