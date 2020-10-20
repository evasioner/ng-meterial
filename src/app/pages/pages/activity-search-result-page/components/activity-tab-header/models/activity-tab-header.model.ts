export interface SortOrder {
    text: string;
    value: string;
    active: boolean;
}

export const SortOrderSet: SortOrder[] = [
    { text: '추천순', value: 'Recommend', active: false },
    { text: '인기순', value: 'Popularity', active: false },
    { text: '낮은가격순', value: 'AmountLowest', active: false },
    { text: '높은가격순', value: 'AmountHighest', active: false },
    { text: '최근순', value: 'Newest', active: false },
    { text: '평점순', value: 'ReviewAverage', active: false }
];
