import { environment } from '../../../../../environments/environment.prod';
/**
 * utilMenu
 * 유틸 메뉴
 */
export interface UtilMenu {
    text: string;
    view?: boolean;
    link?: string;
    clickEvent?: string;
    target?: string;
    image?: string;
    className?: string;
    active?: boolean;
}

export const UtilMenuList: UtilMenu[] = [
    {
        text: '로그인',
        view: true,
        clickEvent: 'onGoToLogin',
    },
    {
        text: '로그아웃',
        view: false,
    },
    {
        text: '예약확인/결제',
        view: true,
    },
    {
        text: '고객센터',
        view: true,
    },
    {
        text: 'PC버전',
        link: environment.pcUrl
    }
];

export const YbSNSList: UtilMenu[] = [
    {
        link: 'https://www.facebook.com/yellowballoonofficial/',
        target: '_blank',
        image: '/assets/images/common/global/btn_fnb_sns1.png',
        text: 'facebook',
        className: 'facebook'
    },
    {
        link: 'https://www.instagram.com/yellowballoon_official/',
        target: '_blank',
        image: '/assets/images/common/global/btn_fnb_sns2.png',
        text: 'instagram',
        className: 'instagram'
    },
    {
        link: 'https://www.youtube.com/user/ybtour2013',
        target: '_blank',
        image: '/assets/images/common/global/btn_fnb_sns7.png',
        text: 'youtube',
        className: 'youtube'
    },
    {
        link: 'https://pf.kakao.com/_hhAxbd',
        target: '_blank',
        image: '/assets/images/common/global/btn_fnb_sns3.png',
        text: 'kakao',
        className: 'kakao'
    },
    {
        link: 'https://blog.naver.com/yb_tour',
        target: '_blank',
        image: '/assets/images/common/global/btn_fnb_sns5.png',
        text: 'naver blog',
        className: 'blog'
    },
    {
        link: 'https://post.naver.com/myProfile.nhn?memberNo=1173675',
        target: '_blank',
        image: '/assets/images/common/global/btn_fnb_sns6.png',
        text: 'naver post',
        className: 'post'
    }
];

export const YbNavList: UtilMenu[] = [
    {
        link: `${environment.ybUrl}/common/privacy.yb`,
        text: '개인정보처리방침',
        target: '_self'
    },
    {
        link: `${environment.ybUrl}/common/internetAgree.yb`,
        text: '인터넷회원규정',
        target: '_self'
    },
    {
        link: `${environment.ybUrl}/common/travelAgree.yb`,
        text: '여행약관',
        target: '_self'
    },
    {
        link: `${environment.ybUrl}/common/travelerInsuInfo.yb`,
        text: '여행자보험',
        target: '_self'
    }
];