export enum InicisPaymentCode {
    CARD = 'CARD', // (신용카드)
    MOBILE = 'MOBILE', // (휴대폰)
    BANK = 'BANK', // (계좌이체)
    VBANK = 'VBANK', // (가상계좌)
    CULTURE = 'CULTURE', // (문화상품권)
    HPMN = 'HPMN', // (해피머니)
    DGCL = 'DGCL', // (스마트문상)
}

export enum InicisPaymentCommon {
    RETURN_URL = '/payment-complete',
}

export enum InicisMessage {
    CARD_FAIL = '결제의 실패하였습니다. 카드를 확인 하신 후 다시 시도해주세요.',
}