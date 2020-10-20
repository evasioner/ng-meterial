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
    cityName: string;
    currency: ViewModelCurrency;
    plug: ViewModelPlug;
    time: ViewModeltime;
    weather: ViewModelWeather[];
}

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
    cityName: '',
    currency: ViewModelCurrencySet,
    plug: ViewModelPlugSet,
    time: ViewModeltimeSet,
    weather: ViewModelWeatherSet
};

