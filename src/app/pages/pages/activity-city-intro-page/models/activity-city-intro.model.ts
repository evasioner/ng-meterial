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
        styleType: 'icon-all'
    }, // 전체
    {
        categoryName: 'CATEGORY_ITEM_TITLE_TYPE1',
        code: 'AC01',
        name: '',
        count: 0,
        lowestAmount: 0,
        styleType: 'icon-sim'
    }, // WIFI&SIM
    {
        categoryName: 'CATEGORY_ITEM_TITLE_TYPE2',
        code: 'AC02',
        name: '',
        count: 0,
        lowestAmount: 0,
        styleType: 'icon-service'
    }, // 여행서비스
    {
        categoryName: 'CATEGORY_ITEM_TITLE_TYPE3',
        code: 'AC03',
        name: '',
        count: 0,
        lowestAmount: 0,
        styleType: 'icon-pickup'
    }, // 픽업/샌딩
    {
        categoryName: 'CATEGORY_ITEM_TITLE_TYPE4',
        code: 'AC04',
        name: '',
        count: 0,
        lowestAmount: 0,
        styleType: 'icon-ticket'
    }, // 티켓/패스
    {
        categoryName: 'CATEGORY_ITEM_TITLE_TYPE5',
        code: 'AC05',
        name: '',
        count: 0,
        lowestAmount: 0,
        styleType: 'icon-tour'
    }, // 투어
    {
        categoryName: 'CATEGORY_ITEM_TITLE_TYPE6',
        code: 'AC06',
        name: '',
        count: 0,
        lowestAmount: 0,
        styleType: 'icon-experience'
    }, // 체험
    {
        categoryName: 'CATEGORY_ITEM_TITLE_TYPE7',
        code: 'AC07',
        name: '',
        count: 0,
        lowestAmount: 0,
        styleType: 'icon-delicious'
    } // 맛집
];
