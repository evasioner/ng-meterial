/**
 * ViewModelActivety
 * 액티비티 데이터
 */
export interface ViewModelActivety {
    activityCode: string;
    activityName: string;
    activityTypeCode: string;
    activityTypeName: string;
    activityLocationName?: string;
    billingAmount: number;
    billingSumAmount: number;
    currencyCode: string;
    deliveryTypeCode: string;
    deliveryTypeName: string;
    photoUrls: string;
    reviewAverage: number;
    reviewCount: number;
    taxAmount: number;
}

/**
 * ViewModelWeather
 * viewModel 전체
 */
export interface ViewModel {
    activityType: string;
    activityList?: ViewModelActivety[];
    loadingFlag: boolean;
    cityName: string;
}

export const ViewModelActivetySet: ViewModelActivety[] = [];

export const ViewModelSet: ViewModel = {
    activityType: '추천',
    activityList: ViewModelActivetySet,
    loadingFlag: true,
    cityName: '',
};