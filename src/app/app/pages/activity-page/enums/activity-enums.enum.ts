export enum ActivityEnums {
    PAGE_TOTAL_MAIN = '/main',
    PAGE_MAIN = '/activity-main/',
    PAGE_CITY_INTRO = '/activity-city-intro/',
    PAGE_SEARCH_RESULT = '/activity-search-result/',
    PAGE_SEARCH_RESULT_DETAIL = '/activity-search-result-detail/',
    PAGE_SEARCH_RESULT_OPTION = '/activity-search-result-option/',
    PAGE_BOOKING_INFORMATION = '/activity-booking-information/',
    PAGE_BOOKING = '/activity-booking/',
    PAGE_BOOKING_COMPLETE = '/activity-booking-complete/',

    // INPUT : 검색어 입력(사용X 2020.06.09), CITY : 도시 선택, CATEGORY : 카테고리 선택, DETAIL : 상품 선택.
    SEARCH_TYPE_INPUT = 'INPUT',
    SEARCH_TYPE_CITY = 'CITY',
    SEARCH_TYPE_CATEGORY = 'CATEGORY',
    SEARCH_TYPE_DETAIL = 'DETAIL',

    // 아이템 카테고리 코드
    // IC01 항공
    // IC02 호텔
    // IC03 렌터카
    // IC04 액티비티
    // IC05 일정표
    IITEM_CATEGORY_CODE = 'IC04',

    // STORE IDs
    STORE_COMMON = 'activity-common',
    STORE_RESULT_LIST_RQ = 'activity-list-rq-info',
    STORE_RESULT_LIST_RS = 'activity-list-rs',
    STORE_CITYINTRO_RQ = 'activity-cityintro-rq-info',
    STORE_CITYINTRO_RS = 'activity-cityintro-rs',
    STORE_CITYINTRO_CITYNAME = 'activity-cityintro-cityName',
    STORE_RESULT_DETAIL_RQ = 'activity-detail-rq-info',
    STORE_RESULT_OPTION_RQ = 'activity-option-rq-info',
    STORE_RESULT_OPTION_RS = 'activity-option-rs',
    STORE_CALENDAR = 'activity-calendar',
    STORE_BOOKING_INFORMATION = 'activity-booking-information',
    STORE_BOOKING_INFORMATION_RS = 'activity-booking-information-rs',
    STORE_BOOKING_INFORMATION_RQ = 'activity-booking-information-rq',
    STORE_BOOKING = 'activity-booking',
    STORE_PAYMENT = 'activity-payment'
}
