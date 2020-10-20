import { RentUiState } from '../../../insterfaces/rent-ui-state';
import { SearchResultPageState } from '@/app/common-source/enums/search-result-page-state.enum';
import { SearchResultListState } from '@/app/common-source/enums/search-result-list-state.enum';

export interface Pagination {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    maxSize: number;
    disabled: boolean;
}

export const PaginationSet: Pagination = {
    currentPage: 0,
    totalItems: 0,
    itemsPerPage: 12,
    maxSize: 5,
    disabled: false
};

export interface CompareMenu {
    text: string;
    value: boolean;
    state: string;
}

export const CompareMenuSet: CompareMenu[] = [
    { text: '비교하기', value: true, state: SearchResultPageState.IS_DEFAULT },
    { text: '비교해제', value: false, state: SearchResultPageState.IS_COMPARE }
];

export interface ListMenu {
    className: string;
    text: string;
    state: string;
}

export const ListMenuSet: ListMenu[] = [
    {
        className: 'btn-view-type list',
        text: '리스트형식으로 보기',
        state: SearchResultListState.IS_LIST
    },
    {
        className: 'btn-view-type card',
        text: '카드형식으로 보기',
        state: SearchResultListState.IS_CARD
    }
];

export interface ViewModel {
    pagination: Pagination;
    apiComplete: boolean;
    compareList: Array<any>;
    compareMenuList: CompareMenu[];
    listMenuList: ListMenu[];
    uiState: RentUiState;
    carList: Array<any>;
    compareEnums: any;
    listEnums: any;
}

export const ViewModelSet: ViewModel = {
    pagination: PaginationSet,
    apiComplete: false,
    compareList: [],
    compareMenuList: CompareMenuSet,
    listMenuList: ListMenuSet,
    uiState: {
        state: SearchResultPageState.IS_DEFAULT,
        listState: SearchResultListState.IS_LIST,
        btnCompareToggleBool: false
    },
    carList: [],
    compareEnums: SearchResultPageState,
    listEnums: SearchResultListState
};