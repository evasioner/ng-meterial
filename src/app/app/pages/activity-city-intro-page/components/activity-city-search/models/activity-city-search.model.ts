import { BsModalRef } from 'ngx-bootstrap/modal';


/**
 * ViewModelCategory
 * viewModel 도시 관련 카테고리
 */
export interface ViewModelCategory {
    categoryName?: string;
    code: string;
    name: string;
    count: number;
    lowestAmount: number;
    styleType?: string;
    translateName?: string;
}
/**
 * ViewModelCurrency
 * viewModel 통화
 */
export interface ViewModelCurrency {
    convertRate: number;
    now: Date;
    originCurrencyCode: string;
    targetCurrencyCode: string;
}

/**
 * ViewModelPlug
 * viewModel 플러그
 */
export interface ViewModelPlug {
    plugTypeCode: string;
    voltage: string;
}

/**
 * ViewModeltime
 * viewModel 시간
 */
export interface ViewModeltime {
    difference: number;
    fullLocalTime?: string;
    local: string;
    now: string;
}

/**
 * ViewModelWeather
 * viewModel 날씨
 */
export interface ViewModelWeather {
    weatherDate: string;
    weatherCode: string;
    weatherDesc: string;
    minTemperature: number;
    maxTemperature: number;
}

/**
 * ViewModelWeather
 * viewModel 전체
 */
export interface ViewModel {
    loadingFlag: boolean;
    cityName: string;
    cityImage: string;
    cityInfoFlag: boolean;
    currency: ViewModelCurrency;
    plug: ViewModelPlug;
    time: ViewModeltime;
    weather: ViewModelWeather[];
    categoryList: ViewModelCategory[];
    bsModalRef: BsModalRef;
    bsModalCityInfoRef: BsModalRef;
}

/**
 * ViewModelCategorySet
 * 도시 카테고리 정보 초기화
 */
export const ViewModelCategorySet: ViewModelCategory[] = [
    {
        categoryName: 'CATEGORY_ITEM_TITLE_ALL',
        code: 'ALL',
        name: '',
        count: 0,
        lowestAmount: 0,
        styleType: 'all'
    }, // 전체
    {
        categoryName: 'CATEGORY_ITEM_TITLE_TYPE1',
        code: 'AC01',
        name: '',
        count: 0,
        lowestAmount: 0,
        styleType: 'sim'
    }, // WIFI&SIM
    {
        categoryName: 'CATEGORY_ITEM_TITLE_TYPE2',
        code: 'AC02',
        name: '',
        count: 0,
        lowestAmount: 0,
        styleType: 'service'
    }, // 여행서비스
    {
        categoryName: 'CATEGORY_ITEM_TITLE_TYPE3',
        code: 'AC03',
        name: '',
        count: 0,
        lowestAmount: 0,
        styleType: 'pickup'
    }, // 픽업/샌딩
    {
        categoryName: 'CATEGORY_ITEM_TITLE_TYPE4',
        code: 'AC04',
        name: '',
        count: 0,
        lowestAmount: 0,
        styleType: 'ticket'
    }, // 티켓/패스
    {
        categoryName: 'CATEGORY_ITEM_TITLE_TYPE5',
        code: 'AC05',
        name: '',
        count: 0,
        lowestAmount: 0,
        styleType: 'tour'
    }, // 투어
    {
        categoryName: 'CATEGORY_ITEM_TITLE_TYPE6',
        code: 'AC06',
        name: '',
        count: 0,
        lowestAmount: 0,
        styleType: 'experience'
    }, // 체험
    {
        categoryName: 'CATEGORY_ITEM_TITLE_TYPE7',
        code: 'AC07',
        name: '',
        count: 0,
        lowestAmount: 0,
        styleType: 'delicious'
    } // 맛집 
];

/**
 * ViewModelCurrencySet
 * 통화 정보 초기화
 */
export const ViewModelCurrencySet: ViewModelCurrency = {
    convertRate: 0,
    now: new Date(),
    originCurrencyCode: '',
    targetCurrencyCode: ''
};

/**
 * ViewModelPlugSet
 * 플로그 정보 초기화
 */
export const ViewModelPlugSet: ViewModelPlug = {
    plugTypeCode: '',
    voltage: ''
};

/**
 * ViewModeltimeSet
 * 시간 정보 초기화
 */
export const ViewModeltimeSet: ViewModeltime = {
    difference: 0,
    fullLocalTime: '',
    local: '',
    now: ''
};

/**
 * ViewModelWeatherSet
 * 날씨 정보 초기화
 */
export const ViewModelWeatherSet: ViewModelWeather[] = [];

/**
 * ViewModelSet
 * 뷰모델 초기화
 */
export const ViewModelSet: ViewModel = {
    loadingFlag: true,
    cityName: '',
    cityImage: '/assets/images/temp/@temp-activity-city-intro.png',
    cityInfoFlag: false,
    currency: ViewModelCurrencySet,
    plug: ViewModelPlugSet,
    time: ViewModeltimeSet,
    weather: ViewModelWeatherSet,
    categoryList: ViewModelCategorySet,
    bsModalRef: null,
    bsModalCityInfoRef: null
};

