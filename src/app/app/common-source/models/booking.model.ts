export interface CardType {
    code: string;
    text: string;
    selected: boolean;
}

export interface PaymentStyle {
    text: string;
    checked: boolean;
}

// 결제 공통
export const CardSet: CardType[] = [
    { code: '', text: '카드를 선택해 주세요.', selected: true },
    { code: 'AM', text: '롯데 아멕스', selected: false },
    { code: 'BC', text: 'BC카드', selected: false },
    { code: 'CJ', text: '제주카드', selected: false },
    { code: 'CT', text: '씨티카드', selected: false },
    { code: 'CU', text: '신협카드', selected: false },
    { code: 'DI', text: '현대카드', selected: false },
    { code: 'HM', text: '한미카드', selected: false },
    { code: 'HN', text: '하나카드', selected: false },
    { code: 'JB', text: '전북카드', selected: false },
    { code: 'KD', text: '산업카드', selected: false },
    { code: 'KE', text: '외환카드', selected: false },
    { code: 'KJ', text: '광주카드', selected: false },
    { code: 'KM', text: 'KB국민카드', selected: false },
    { code: 'LO', text: '롯데카드', selected: false },
    { code: 'NH', text: 'NH채움카드', selected: false },
    { code: 'PH', text: '우리카드', selected: false },
    { code: 'SB', text: '저축카드', selected: false },
    { code: 'SG', text: '신세계한미', selected: false },
    { code: 'SH', text: '신한카드', selected: false },
    { code: 'SS', text: '삼성카드', selected: false },
    { code: 'SU', text: '수협카드', selected: false },
    { code: 'UF', text: '은련카드', selected: false }
];

export const CardMonthSet: CardType[] = new Array(26).fill(null).map(
    (value: any, index: number): CardType => {
        if (index === 0) {
            return { code: '', text: '할부기간', selected: true };
        } else if (index === 1) {
            return { code: '00', text: '일시불', selected: false };
        } else {
            const counter = (index);

            if (counter < 10) {
                return { code: String(`0${counter}`), text: `0${counter}`, selected: false };
            } else {
                return { code: String(counter), text: String(counter), selected: false };
            }
        }
    }
);