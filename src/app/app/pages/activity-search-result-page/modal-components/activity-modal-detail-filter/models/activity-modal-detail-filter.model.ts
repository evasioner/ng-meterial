/**
 * ViewModelCheckBoxGuide
 * 가이드 체크박스
 */
export interface ViewModelCheckBoxGuide {
    text: string;
    code: boolean;
    checked: boolean;
}

export const ViewModelCheckBoxGuideSet: ViewModelCheckBoxGuide[] = [
    { text: '가이드 있음', code: true, checked: false },
    { text: '가이드 없음', code: false, checked: false }
];
