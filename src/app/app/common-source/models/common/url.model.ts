export interface PageUrl {
    url: string;
    returnUrl: string;
}

export const PageUrlList: PageUrl[] = [
    { url: '/main', returnUrl: '/main' },

    { url: '/flight-main', returnUrl: '/main' },
    { url: '/flight-search-result-go', returnUrl: '/flight-main' },
    { url: '/flight-search-result-come', returnUrl: '/flight-main' },
    { url: '/flight-search-result-multi', returnUrl: '/flight-main' },
    { url: '/flight-booking-payment', returnUrl: '/flight-main' },
    { url: '/flight-booking-information', returnUrl: '/flight-main' },
    { url: '/flight-booking-complete', returnUrl: '/flight-main' },

    { url: '/hotel-main', returnUrl: '/main' },
    { url: '/hotel-search-result', returnUrl: '/hotel-main' },
    { url: '/hotel-search-roomtype', returnUrl: '/hotel-main' },
    { url: '/hotel-search-information', returnUrl: '/hotel-main' },
    { url: '/hotel-search-payment', returnUrl: '/hotel-main' },
    { url: '/hotel-search-complete', returnUrl: '/hotel-main' },

    { url: '/rent-main', returnUrl: '/main' },
    { url: '/rent-search-result', returnUrl: '/rent-main' },
    { url: '/rent-booking-information', returnUrl: '/rent-main' },
    { url: '/rent-booking-payment', returnUrl: '/rent-main' },
    { url: '/rent-booking-complete', returnUrl: '/rent-main' },

    { url: '/activity-main', returnUrl: '/main' },
    { url: '/activity-search-result', returnUrl: '/activity-main' },
    { url: '/activity-city-intro', returnUrl: '/activity-main' },
    { url: '/activity-search-result-detail', returnUrl: '/activity-main' },
    { url: '/activity-search-result-option', returnUrl: '/activity-main' },
    { url: '/activity-booking-information', returnUrl: '/activity-main' },
    { url: '/activity-booking-payment', returnUrl: '/activity-main' },
    { url: '/activity-booking-complete', returnUrl: '/activity-main' },

    { url: '/my-main', returnUrl: '/main' },
    { url: '/my-reservation-list', returnUrl: '/my-main' },
    { url: '/my-reservation-flight-detail', returnUrl: '/my-main' },
    { url: '/my-reservation-hotel-detail', returnUrl: '/my-main' },
    { url: '/my-reservation-rent-detail', returnUrl: '/my-main' },
    { url: '/my-reservation-activity-detail', returnUrl: '/my-main' },
];

