import { CardType, PaymentStyle } from '@/app/common-source/models/booking.model';

export const UseCardSet: CardType[] = [
    { code: '', text: '카드를 선택해 주세요.', selected: true },
    { code: 'CCH01', text: '탑승자 본인카드', selected: false },
    { code: 'CCH02', text: '탑승자 가족카드', selected: false },
    { code: 'CCH03', text: '탑승자 법인카드', selected: false }
];

export const PaymnetStyleSet: PaymentStyle[] = [
    { text: '한번에 결제', checked: true },
    { text: '탑승자별 결제', checked: false }
];