import { Routes } from '@angular/router';

import { LoginGuard } from '../common-source/guard/login/login.guard';

import { MyComQsResolveService } from '../common-source/guard/resolve/my-com-qs-resolve/my-com-qs-resolve.service';

/**
 * 페이지 라우트
 */
export const pageRoutes: Routes = [
    //------------------------------------------[공통]
    {
        path: 'system-error',
        loadChildren: () => import('../pages/cm-system-error/cm-system-error.module').then(mod => mod.CmSystemErrorModule)
    },

    //------------------------------------------[통합메인]
    {
        path: '',
        redirectTo: '/main',
        pathMatch: 'full'
    },
    {
        path: 'main',
        loadChildren: () => import('../pages/main-page/main-page.module').then(mod => mod.MainPageModule)
    },
    //------------------------------------------[항공]
    // 항공 메인
    {
        path: 'flight-main',
        loadChildren: () => import('../pages/flight-main-page/flight-main-page.module').then(mod => mod.FlightMainPageModule)
    },
    {
        path: 'flight-main/:id',
        loadChildren: () => import('../pages/flight-main-page/flight-main-page.module').then(mod => mod.FlightMainPageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 항공 검색 결과(가는편)
    {
        path: 'flight-search-result-go/:id',
        loadChildren: () => import('../pages/flight-search-result-go-page/flight-search-result-go-page.module').then(mod => mod.FlightSearchResultGoPageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 항공 검색 결과(오는편)
    {
        path: 'flight-search-result-come/:id',
        loadChildren: () => import('../pages/flight-search-result-come-page/flight-search-result-come-page.module').then(mod => mod.FlightSearchResultComePageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 항공 검색 결과(다구간)
    {
        path: 'flight-search-result-multi/:id',
        loadChildren: () => import('../pages/flight-search-result-multi-page/flight-search-result-multi-page.module').then(mod => mod.FlightSearchResultMultiPageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 결제하기
    {
        path: 'flight-booking-payment',
        loadChildren: () => import('../pages/flight-booking-payment-page/flight-booking-payment-page.module').then(mod => mod.FlightBookingPaymentPageModule)
    },
    // 예약 정보 입력(탑승자 정보 입력)
    {
        path: 'flight-booking-information',
        loadChildren: () => import('../pages/flight-booking-information-page/flight-booking-information-page.module').then(mod => mod.FlightBookingInformationPageModule)
    },
    // 결제완료
    {
        path: 'flight-booking-complete',
        loadChildren: () => import('../pages/flight-booking-complete-page/flight-booking-complete-page.module').then(mod => mod.FlightBookingCompletePageModule)
    },
    //------------------------------------------[호텔]
    //호텔 메인
    {
        path: 'hotel-main',
        loadChildren: () => import('../pages/hotel-main-page/hotel-main-page.module').then(mod => mod.HotelMainPageModule)
    },
    {
        path: 'hotel-main/:id',
        loadChildren: () => import('../pages/hotel-main-page/hotel-main-page.module').then(mod => mod.HotelMainPageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    //호텔 검색 결과
    {
        path: 'hotel-search-result/:id',
        loadChildren: () => import('../pages/hotel-search-result-page/hotel-search-result-page.module').then(mod => mod.HotelSearchResultPageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    //호텔 룸타입 선택
    {
        path: 'hotel-search-roomtype/:id',
        loadChildren: () => import('../pages/hotel-search-roomtype-page/hotel-search-roomtype-page.module').then(mod => mod.HotelSearchRoomtypePageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    //호텔 예약자 정보 입력
    {
        path: 'hotel-booking-information',
        loadChildren: () => import('../pages/hotel-booking-information-page/hotel-booking-information-page.module').then(mod => mod.HotelBookingInformationPageModule)
    },
    //호텔 결제하기
    {
        path: 'hotel-booking-payment',
        loadChildren: () => import('../pages/hotel-booking-payment-page/hotel-booking-payment-page.module').then(mod => mod.HotelBookingPaymentPageModule)
    },
    //호텔 예약완료
    {
        path: 'hotel-booking-complete',
        loadChildren: () => import('../pages/hotel-booking-complete-page/hotel-booking-complete-page.module').then(mod => mod.HotelBookingCompletePageModule)
    },
    //------------------------------------------[묶음할인]
    {
        path: 'airtel-main',
        loadChildren: () => import('../pages/airtel-main-page/airtel-main-page.module').then(mod => mod.AirtelMainPageModule)
    },
    {
        path: 'airtel-search-result-go/:id',
        loadChildren: () => import('../pages/airtel-search-result-go-page/airtel-search-result-go-page.module').then(mod => mod.AirtelSearchResultGoPageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    {
        path: 'airtel-search-result-come/:id',
        loadChildren: () => import('../pages/airtel-search-result-come-page/airtel-search-result-come-page.module').then(mod => mod.AirtelSearchResultComePageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    {
        path: 'airtel-search-result',
        loadChildren: () => import('../pages/airtel-search-result-page/airtel-search-result-page.module').then(mod => mod.AirtelSearchResultPageModule)
    },
    {
        path: 'airtel-search-roomtype',
        loadChildren: () => import('../pages/airtel-search-roomtype-page/airtel-search-roomtype-page.module').then(mod => mod.AirtelSearchRoomtypePageModule)
    },
    {
        path: 'airtel-traveler-information',
        loadChildren: () => import('../pages/airtel-traveler-information-page/airtel-traveler-information-page.module').then(mod => mod.AirtelTravelerInformationPageModule)
    },
    // {
    //     path: 'airtel-booking',
    //     component: AirtelBookingPageComponent
    // },
    // {
    //     path: 'airtel-booking-complete',
    //     component: AirtelBookingCompletePageComponent
    // },
    //------------------------------------------[렌터카]
    // 렌터카 메인
    {
        path: 'rent-main',
        loadChildren: () => import('../pages/rent-main-page/rent-main-page.module').then(mod => mod.RentMainPageModule)
    },
    {
        path: 'rent-main/:id',
        loadChildren: () => import('../pages/rent-main-page/rent-main-page.module').then(mod => mod.RentMainPageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 렌터카 결과
    {
        path: 'rent-search-result/:id',
        loadChildren: () => import('../pages/rent-search-result-page/rent-search-result-page.module').then(mod => mod.RentSearchResultPageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 렌터카 상세
    {
        path: 'rent-search-result-detail/:id',
        loadChildren: () => import('../pages/rent-search-result-detail-page/rent-search-result-detail-page.module').then(mod => mod.RentSearchResultDetailPageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 렌터카 예약자 정보 입력
    {
        path: 'rent-booking-information/:id',
        loadChildren: () => import('../pages/rent-booking-information-page/rent-booking-information-page.module').then(mod => mod.RentBookingInformationPageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 렌터카 결제완료
    {
        path: 'rent-booking-complete/:id',
        loadChildren: () => import('../pages/rent-booking-complete-page/rent-booking-complete-page.module').then(mod => mod.RentBookingCompletePageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    //------------------------------------------[액티비티]
    // 액티비티 메인
    {
        path: 'activity-main',
        loadChildren: () => import('../pages/activity-page/activity-page.module').then(mod => mod.ActivityPageModule)
    },
    {
        path: 'activity-main',
        loadChildren: () => import('../pages/activity-page/activity-page.module').then(mod => mod.ActivityPageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 액티비티 결과
    {
        path: 'activity-search-result/:id',
        loadChildren: () => import('../pages/activity-search-result-page/activity-search-result-page.module').then(mod => mod.ActivitySearchResultPageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 액티비티 도시 인트로
    {
        path: 'activity-city-intro/:id',
        loadChildren: () => import('../pages/activity-city-intro-page/activity-city-intro-page.module').then(mod => mod.ActivityCityIntroPageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    { // 노랑풍선에서 링크 타고 올 시
        path: 'activity-city-intro',
        loadChildren: () => import('../pages/activity-city-intro-page/activity-city-intro-page.module').then(mod => mod.ActivityCityIntroPageModule),
    },
    // 액티비티 상품 상세 정보
    {
        path: 'activity-search-result-detail/:id',
        loadChildren: () => import('../pages/activity-search-result-detail-page/activity-search-result-detail-page.module').then(mod => mod.ActivitySearchResultDetailPageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 액티비티 예약하기
    {
        path: 'activity-search-result-option/:id',
        loadChildren: () => import('../pages/activity-search-result-option-page/activity-search-result-option-page.module').then(mod => mod.ActivitySearchResultOptionPageModule),
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 액티비티 예약 정보 입력
    {
        path: 'activity-booking-information',
        loadChildren: () => import('../pages/activity-booking-information-page/activity-booking-information-page.module').then(mod => mod.ActivityBookingInformationPageModule)
    },
    // 액티비티 결제하기
    {
        path: 'activity-booking-payment',
        loadChildren: () => import('../pages/activity-booking-payment-page/activity-booking-payment-page.module').then(mod => mod.ActivityBookingPaymentPageModule)
    },
    // 액티비티 결제완료
    {
        path: 'activity-booking-complete',
        loadChildren: () => import('../pages/activity-booking-complete-page/activity-booking-complete-page.module').then(mod => mod.ActivityBookingCompletePageModule)
    },
    //------------------------------------------[마이페이지]
    // 마이페이지 메인
    {
        path: 'my-main',
        loadChildren: () => import('../pages/my-main-page/my-main-page.module').then(mod => mod.MyMainPageModule),
        canActivate: [LoginGuard],
    },
    // 마이페이지 예약리스트
    {
        path: 'my-reservation-list/:id',
        loadChildren: () => import('../pages/my-reservation-list-page/my-reservation-list-page.module').then(mod => mod.MyReservationListPageModule),
        canActivate: [LoginGuard],
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 마이페이지 항공 예약상세
    {
        path: 'my-reservation-flight-detail/:id',
        loadChildren: () => import('../pages/my-reservation-flight-detail-page/my-reservation-flight-detail-page.module').then(mod => mod.MyReservationFlightDetailPageModule),
        canActivate: [LoginGuard],
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 마이페이지 호텔 예약상세
    {
        path: 'my-reservation-hotel-detail/:id',
        loadChildren: () => import('../pages/my-reservation-hotel-detail-page/my-reservation-hotel-detail-page.module').then(mod => mod.MyReservationHotelDetailPageModule),
        canActivate: [LoginGuard],
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 마이페이지 렌터카 예약상세
    {
        path: 'my-reservation-rent-detail/:id',
        loadChildren: () => import('../pages/my-reservation-rent-detail-page/my-reservation-rent-detail-page.module').then(mod => mod.MyReservationRentDetailPageModule),
        canActivate: [LoginGuard],
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 마이페이지 액티비티 예약상세
    {
        path: 'my-reservation-activity-detail/:id',
        loadChildren: () => import('../pages/my-reservation-activity-detail-page/my-reservation-activity-detail-page.module').then(mod => mod.MyReservationActivityDetailPageModule),
        canActivate: [LoginGuard],
        resolve: {
            resolveData: MyComQsResolveService
        }
    },
    // 취소 페이지 개발 시 변경 예정
    // // 마이페이지 항공 예약취소
    // {
    //     path: 'my-reservation-flight-cancel',
    //     loadChildren: () => import('../pages/my-reservation-flight-cancel-page/my-reservation-flight-cancel-page.module').then(mod => mod.MyReservationFlightCancelPageModule),
    //     // canActivate: [LoginGuard],
    // },
    // // 마이페이지 호텔 예약취소
    // {
    //     path: 'my-reservation-hotel-cancel',
    //     loadChildren: () => import('../pages/my-reservation-hotel-cancel-page/my-reservation-hotel-cancel-page.module').then(mod => mod.MyReservationHotelCancelPageModule),
    //     // canActivate: [LoginGuard],
    // },
    // // 마이페이지 렌터카 예약취소
    // {
    //     path: 'my-reservation-rent-cancel',
    //     loadChildren: () => import('../pages/my-reservation-rent-cancel-page/my-reservation-rent-cancel-page.module').then(mod => mod.MyReservationRentCancelPageModule),
    //     // canActivate: [LoginGuard],
    // },
    // // 마이페이지 액티비티 예약취소
    // {
    //     path: 'my-reservation-activity-cancel',
    //     loadChildren: () => import('../pages/my-reservation-activity-cancel-page/my-reservation-activity-cancel-page.module').then(mod => mod.MyReservationActivityCancelPageModule),
    //     // canActivate: [LoginGuard],
    // },
    // // 마이페이지 예약문의 리스트
    // {
    //     path: 'my-reservation-qna-list',
    //     loadChildren: () => import('../pages/my-reservation-qna-list-page/my-reservation-qna-list-page.module').then(mod => mod.MyReservationQnaListPageModule),
    //     // canActivate: [LoginGuard],
    // },
    // 마이페이지 항공 예약취소
    {
        path: 'my-reservation-flight-cancel',
        loadChildren: () => import('../pages/my-reservation-flight-detail-page/my-reservation-flight-detail-page.module').then(mod => mod.MyReservationFlightDetailPageModule),
        canActivate: [LoginGuard]
    },
    // 마이페이지 호텔 예약취소
    {
        path: 'my-reservation-hotel-cancel',
        loadChildren: () => import('../pages/my-reservation-hotel-detail-page/my-reservation-hotel-detail-page.module').then(mod => mod.MyReservationHotelDetailPageModule),
        canActivate: [LoginGuard]
    },
    // 마이페이지 렌터카 예약취소
    {
        path: 'my-reservation-rent-cancel',
        loadChildren: () => import('../pages/my-reservation-rent-detail-page/my-reservation-rent-detail-page.module').then(mod => mod.MyReservationRentDetailPageModule),
        canActivate: [LoginGuard]
    },
    // 마이페이지 액티비티 예약취소
    {
        path: 'my-reservation-activity-cancel',
        loadChildren: () => import('../pages/my-reservation-activity-detail-page/my-reservation-activity-detail-page.module').then(mod => mod.MyReservationActivityDetailPageModule),
        canActivate: [LoginGuard]
    },
    // 마이페이지 예약문의 리스트
    {
        path: 'my-reservation-qna-list',
        loadChildren: () => import('../pages/my-reservation-qna-list-page/my-reservation-qna-list-page.module').then(mod => mod.MyReservationQnaListPageModule),
        canActivate: [LoginGuard]
    },
    // 마이페이지 장바구니
    {
        path: 'my-basket-list',
        loadChildren: () => import('../pages/my-basket-list-page/my-basket-list-page.module').then(mod => mod.MyBasketListPageModule),
        canActivate: [LoginGuard]
    },
    // 마이페이지 최근 본 상품 리스트
    {
        path: 'my-recent-list',
        loadChildren: () => import('../pages/my-recent-list-page/my-recent-list-page.module').then(mod => mod.MyRecentListPageModule),
        canActivate: [LoginGuard]
    },
    // 마이페이지 문의하기 리스트
    {
        path: 'my-qna-list',
        loadChildren: () => import('../pages/my-qna-list-page/my-qna-list-page.module').then(mod => mod.MyQnaListPageModule),
        canActivate: [LoginGuard]
    },
    // 마이페이지 마일리지 리스트
    {
        path: 'my-mileage-list',
        loadChildren: () => import('../pages/my-mileage-list-page/my-mileage-list-page.module').then(mod => mod.MyMileageListPageModule),
        canActivate: [LoginGuard]
    },
    // 마이페이지 FAQ 리스트
    {
        path: 'my-faq-list',
        loadChildren: () => import('../pages/my-faq-list-page/my-faq-list-page.module').then(mod => mod.MyFaqListPageModule),
        // canActivate: [LoginGuard],
    },
    // 마이페이지 공지사항 리스트
    {
        path: 'my-notice-list',
        loadChildren: () => import('../pages/my-notice-list-page/my-notice-list-page.module').then(mod => mod.MyNoticeListPageModule),
        canActivate: [LoginGuard]
    },
    // 마이페이지 쿠폰 리스트
    {
        path: 'my-coupon-list',
        loadChildren: () => import('../pages/my-coupon-list-page/my-coupon-list-page.module').then(mod => mod.MyCouponListPageModule),
        canActivate: [LoginGuard]
    },
    // 마이페이지 항공 부가서비스
    {
        path: 'my-flight-svc',
        loadChildren: () => import('../pages/my-flight-extra-svc-page/my-flight-extra-svc-page.module').then(mod => mod.MyFlightExtraSvcPageModule),
        canActivate: [LoginGuard]
    },
    // 마이페이지 후기 리스트
    {
        path: 'my-review-list',
        loadChildren: () => import('../pages/my-review-list-page/my-review-list-page.module').then(mod => mod.MyReviewListPageModule),
        canActivate: [LoginGuard]
    },
    // 마이페이지 이벤트 리스트
    {
        path: 'my-event-list',
        loadChildren: () => import('../pages/my-event-list-page/my-event-list-page.module').then(mod => mod.MyEventListPageModule),
        canActivate: [LoginGuard]
    },
    // 마이페이지 이용약관
    {
        path: 'my-agreement-list',
        loadChildren: () => import('../pages/my-agreement-list-page/my-agreement-list-page.module').then(mod => mod.MyAgreementListPageModule),
        canActivate: [LoginGuard]
    },
    //------------------------------------------[여행편의]
    // 여행편의 메인
    {
        path: 'travel-convenience-main',
        loadChildren: () => import('../pages/travel-convenience-main-page/travel-convenience-main-page.module').then(mod => mod.TravelConvenienceMainPageModule)
    },
    // 더보기
    {
        path: 'cm-service',
        loadChildren: () => import('../pages/cm-service/cm-service.module').then(mod => mod.CmServiceModule)
    }
];
