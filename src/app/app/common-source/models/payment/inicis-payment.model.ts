import { environment } from '@/environments/environment';

import { Booker, Travelers } from './booker.model';

import { InicisPaymentCode, InicisPaymentCommon } from '../../enums/payment/inicis-payment.enum';

export interface InicisPayment {
    // 주불 수단
    P_INI_PAYMENT: string;
    // 상점 아이디
    P_MID: string;
    // 주문번호
    P_OID: string;
    // 거래금액
    P_AMT: number;
    // 고객성명
    P_UNAME: string;
    // 가맹점 이름
    P_MNAME?: string;
    // 기타주문정보(값이 보낸 값을 그대로 반환)
    P_NOTI: string;
    // 결제상품명
    P_GOODS: string;
    // 구매자 휴대폰(-포함)
    P_MOBILE?: string;
    // 구매자 이메일
    P_EMAIL?: string;
    // 인증결과 수신 url
    P_NEXT_URL: string;
    // 승인결과통보 url
    P_NOTI_URL?: string;
    // 부가세
    P_TAX: number;
    // 비과세
    P_TAXFREE?: string;
    // 제공기간
    P_OFFER_PERIOD?: string;
    // 신용카드 우선선택 옵션
    P_CARD_OPTION?: string;
    // 신용카드 노출제한 옵션
    P_ONLY_CARDCODE?: string;
    // 신용카드 할부기간(5만원 이상 최대 36개월) 일시불 01부터 36까지
    P_QUOTABASE?: string;
    // 휴대폰결제 필수 컨텐츠 1, 실물: 2
    P_HPP_METHOD?: string;
    // 가상계좌 입금기한 날짜 (20201012)
    P_VBANK_DT?: string;
    // 가상계좌 입금기한 시간 (20:30)
    P_VBANK_TM?: string;
    // 캐릭터 셋
    P_CHARSET: string;
    // 바로 실행 관련 데이터
    P_RESERVED: string;
}

export const InicisPaymentSet: InicisPayment = {
    P_INI_PAYMENT: InicisPaymentCode.CARD,
    P_MID: environment.inicisMid,
    P_OID: '',
    P_AMT: 0,
    P_GOODS: '',
    P_UNAME: '',
    P_NOTI: '',
    P_NEXT_URL: `https://dev-mota.ybtour.co.kr${InicisPaymentCommon.RETURN_URL}`,
    // P_NOTI_URL: '',
    P_CHARSET: 'utf8',
    P_MNAME: '노랑풍선',
    P_TAX: 0,
    P_RESERVED: ''
};

export interface InicisPayCode {
    code: string;
    name: string;
}

export const InicisCardList: InicisPayCode[] = [
    { code: '01', name: '외환카드' },
    { code: '03', name: '롯데카드' },
    { code: '04', name: '현대카드' },
    { code: '06', name: '국민카드' },
    { code: '11', name: '비씨카드' },
    { code: '12', name: '삼성카드' },
    { code: '14', name: '신한카드(구.LG카드 포함)' },
    { code: '21', name: '글로벌 VISA' },
    { code: '22', name: '글로벌 MASTER' },
    { code: '23', name: '글로벌 JCB' },
    { code: '26', name: '중국은련카드' },
    { code: '32', name: '광주카드' },
    { code: '33', name: '전북카드' },
    { code: '34', name: '하나카드' },
    { code: '35', name: '산업카드' },
    { code: '41', name: 'NH카드' },
    { code: '43', name: '씨티카드' },
    { code: '44', name: '우리카드' },
    { code: '48', name: '신협체크카드' },
    { code: '51', name: '수협카드' },
    { code: '52', name: '제주카드' },
    { code: '54', name: 'MG새마을금고체크' },
    { code: '55', name: '케이뱅크카드' },
    { code: '56', name: '카카오뱅크' },
    { code: '71', name: '우체국체크' },
    { code: '95', name: '저축은행체크' },
];

export const InicisBankList: InicisPayCode[] = [
    { code: '02', name: '한국산업은행' },
    { code: '03', name: '기업은행' },
    { code: '04', name: '국민은행' },
    { code: '05', name: '하나은행(구 외환) ' },
    { code: '06', name: '국민은행 (구 주택)' },
    { code: '07', name: '수협중앙회' },
    { code: '11', name: '농협중앙회' },
    { code: '12', name: '단위농협' },
    { code: '16', name: '축협중앙회' },
    { code: '20', name: '우리은행' },
    { code: '21', name: '구)조흥은행' },
    { code: '22', name: '상업은행' },
    { code: '23', name: 'SC제일은행' },
    { code: '24', name: '한일은행' },
    { code: '25', name: '서울은행(구 한미)' },
    { code: '26', name: '구)신한은행' },
    { code: '27', name: '한국씨티은행' },
    { code: '31', name: '대구은행' },
    { code: '32', name: '부산은행' },
    { code: '34', name: '광주은행' },
    { code: '35', name: '제주은행' },
    { code: '37', name: '전북은행' },
    { code: '38', name: '강원은행' },
    { code: '39', name: '경남은행' },
    { code: '41', name: '비씨카드' },
    { code: '45', name: '새마을금고' },
    { code: '48', name: '신용협동조합중앙회 ' },
    { code: '50', name: '상호저축은행' },
    { code: '53', name: '한국씨티은행' },
    { code: '54', name: '홍콩상하이은행' },
    { code: '55', name: '도이치은행' },
    { code: '56', name: 'ABN암로' },
    { code: '57', name: 'JP모건' },
    { code: '59', name: '미쓰비시도쿄은행' },
    { code: '60', name: 'BOA(Bank of America)' },
    { code: '64', name: '산림조합' },
    { code: '70', name: '신안상호저축은행 ' },
    { code: '71', name: '우체국' },
    { code: '81', name: '하나은행' },
    { code: '83', name: '평화은행' },
    { code: '87', name: '신세계' },
    { code: '88', name: '신한(통합)은행' },
    { code: '89', name: '케이뱅크' },
    { code: '90', name: '카카오뱅크' },
    { code: '93', name: '토스머니 (포인트100% 사용)' },
    { code: '94', name: 'SSG머니(포인트 100% 사용)' },
    { code: '96', name: '엘포인트 (포인트 100% 사용)' },
    { code: '97', name: '카카오 머니' },
    { code: '98', name: '페이코(포인트 100% 사용)' },
    { code: 'BW', name: '뱅크월렛' },
    { code: 'D1', name: '유안타증권(구 동양증권)' },
    { code: 'D2', name: '현대증권' },
    { code: 'D3', name: '미래에셋증권' },
    { code: 'D4', name: '한국투자증권' },
    { code: 'D5', name: '우리투자증권' },
    { code: 'D6', name: '하이투자증권' },
    { code: 'D7', name: 'HMC투자증권' },
    { code: 'D8', name: 'SK증권' },
    { code: 'D9', name: '대신증권' },
    { code: 'DA', name: '하나대투증권' },
    { code: 'DB', name: '굿모닝신한증권' },
    { code: 'DC', name: '동부증권' },
    { code: 'DD', name: '유진투자증권' },
    { code: 'DE', name: '메리츠증권' },
    { code: 'DF', name: '신영증권' },
    { code: 'DG', name: '대우증권' },
    { code: 'DH', name: '삼성증권' },
    { code: 'DI', name: '교보증권' },
    { code: 'DJ', name: '키움증권' },
    { code: 'DK', name: '이트레이드' },
    { code: 'DL', name: '솔로몬증권' },
    { code: 'DM', name: '한화증권' },
    { code: 'DN', name: 'NH증권' },
    { code: 'DO', name: '부국증권' },
    { code: 'DP', name: 'LIG증권' }
];

export const InicisQuotaBaseList: InicisPayCode[] = new Array(37).fill(null).map(
    (_value: any, index: number): InicisPayCode => {
        if (index === 0) {
            return { code: '', name: '할부기간' };
        } else {
            const counter = (index);

            if (counter < 10) {
                return { code: String(`0${counter}`), name: counter === 1 ? '일시불' : `0${counter}개월` };
            } else {
                return { code: String(counter), name: `${String(counter)}개월` };
            }
        }
    }
);

export interface InicisCallBack {
    P_AMT: string;
    P_NOTI: string;
    P_REQ_URL: string;
    P_RMESG1: string;
    P_STATUS: string;
    P_TID: string;
}

export interface InicisPayType {
    code: string;
    name: string;
    active: boolean;
}

export const InicisPayTypeList: InicisPayType[] = [
    { code: '', name: '신용카드', active: true },
    { code: 'd_ssgpay=Y', name: 'SSGPAY', active: false },
    { code: 'd_samsungpay=Y', name: 'Samsung', active: false },
    { code: 'd_kakaopay=Y', name: '카카오페이', active: false },
    // { code: '', name: '네이버페이' },
];


export interface EasyPay {
    amount: number;
    // base64로 변환
    encodeData: string;
}

export interface InicisPaymentSecondPayment {
    coupons: Array<any>;
    point: number;
    cards: Array<any>;
    easyPay: EasyPay;
}

export interface InicisPaymentSecond {
    // 선결제로 예약을 진행했을경우에는 반드시 입력해줘야한다.
    bookingCode?: string;
    // 제휴사 예약번호를 먼저 생성하는 경우 사용
    affiliateBookingCode?: string;
    // 뭘까?
    itineraryMasterSeq?: number;
    // 이건 또 뭐지?
    domainAddress?: string;
    // 접속 기기 타입
    deviceTypeCode: string;
    // 예약자
    booker: Booker;
    travelers: Travelers[];
    payment: InicisPaymentSecondPayment;
    flightItems?: any;
    hotelItems?: any;
    rentItems?: any;
    activityItems?: any;
    agreeTerms: number[];
}
