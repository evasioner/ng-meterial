/**
 * MainMenuParams
 * 메인 메뉴 model
 */
export interface MainMenuParams {
    name: string;
    link: string;
    spanClass: string;
    clickEvent?: string;
    subName?: string;
}

/**
 * MainMenuParamsSet
 * 메인 메뉴 관련 기본 값 설정
 */
export const MainMenuParamsSet: MainMenuParams[] = [
    {
        name: '항공',
        link: '/flight-main',
        spanClass: 'flight',
    },
    {
        name: '호텔',
        link: '/hotel-main',
        spanClass: 'hotel',
    },
    {
        name: '액티비티',
        link: '/activity-main',
        spanClass: 'activity',
    },
    {
        name: '묶음할인',
        link: '/airtel-main',
        spanClass: 'airtel',
    },
    {
        name: '여행편의',
        link: '/travel-convenience-main',
        spanClass: 'convenience',
    },
    {
        name: '렌터카',
        link: '/rent-main',
        spanClass: 'rentalcar',
    },
    // {
    //     name: '크루즈',
    //     link: '/main',
    //     spanClass: 'cruise',
    //     subName: '오픈예정'
    // },
    {
        name: '더보기',
        link: '/cm-service',
        spanClass: 'more'
    }
];

/**
 * RecommendMenuParams
 * 추천 메뉴 model
 */
export interface RecommendMenuParams {
    name: string;
    link: string;
    className: string;
    clickEvent?: string;
}

/**
 * RecommendMenuParamsSet
 * 추천 메뉴 기본 값 설정
 */
export const RecommendMenuParamsSet: RecommendMenuParams[] = [
    {
        name: '휴양',
        link: '/main',
        className: 'default' // 선택된 클래스
    },
    {
        name: '배낭',
        link: '/main',
        className: 'line light' // 일반 클래스
    },
    {
        name: '가족',
        link: '/main',
        className: 'line light'
    },
    {
        name: '친구',
        link: '/main',
        className: 'line light'
    },
    {
        name: '연인',
        link: '/main',
        className: 'line light'
    }
];
