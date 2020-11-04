import { PageCodes } from '../enums/page-codes.enum';

/**
 * 목적지 검색 모델
 * 항공       PageCodes.PAGE_FLIGHT
 * 호텔       PageCodes.PAGE_HOTEL
 * 묶음할인    PageCodes.PAGE_AIRTEL
 * 렌터카      PageCodes.PAGE_RENT
 * 액티비티     PageCodes.PAGE_ACTIVITY
 *
 */
export interface DestinationOpen {
    pageCode: PageCodes;
    rq: any;
}
