export interface Delivery {
    code: string;
    nameKr: string;
    nameEn: string;
    checked: boolean;
}

export const DeliveryList: Delivery[] = [
    // {
    //     code: 'ADT01',
    //     nameKr: '배송',
    //     nameEn: 'Offline Delivery',
    //     checked: false
    // },
    // {
    //     code: 'ADT02',
    //     nameKr: '',
    //     nameEn: '',
    //     checked: false
    // },
    {
        code: 'ADT03',
        nameKr: '이티켓',
        nameEn: 'e-Ticket',
        checked: false
    }
];

export interface Gender {
    code: string;
    text: string;
}

export const GenderSet: Gender[] = [
    { code: 'M', text: '남성' },
    { code: 'F', text: '여성' }
];
