export interface Sort {
    text: string;
    value: string;
    active: boolean;
}

export const SortOrderSet: Sort[] = [
    { text: '추천', value: 'Recommend', active: false },
    { text: '높은 등급', value: 'GradeHighest', active: false },
    { text: '낮은 등급', value: 'GradeLowest', active: false },
    { text: '높은 가격', value: 'AmountHighest', active: false },
    { text: '낮은 가격', value: 'AmountLowest', active: false }
];

export interface ViewModel {
    sortOrder: Sort[];
}
