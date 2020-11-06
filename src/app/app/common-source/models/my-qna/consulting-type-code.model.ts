export interface ConsultingTypeCode {
    name: string;
    code: string;
}

export const TypeCodeList: ConsultingTypeCode[] = [
    { name: '대기', code: 'CS001' },
    { name: '답변중', code: 'CS002' },
    { name: '답변완료', code: 'CS003' },
];


