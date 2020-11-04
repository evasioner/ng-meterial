/**
 *
 * 각 메뉴(항공,호텔,렌터카,티켓/투어,일정표,액티비티등)별 요청코드
 * IC01,   // 항공
 * IC02,   // 호텔
 * IC03,   // 렌터카
 * IC04,   // 티켓/투어, 액티비티
 * IC05,   // 일정표
 * IC98,   // 시스템문의
 * IC99,   // 일반문의
 * ICE     // INTER-CITY EXPRESS
 * 
 * 20200213 현재 IC01 ~ IC05 까지만 사용함. 
 * IC05는 내부적으로 어떤 값으로 사용되는지 확인이 필요.
 */
export enum ItemCategoryCode {
    FLIGHT = 'IC01',
    HOTELS = 'IC02',
    RENT = 'IC03',
    ACTIVITY = 'IC04',
    SCHEDULE = 'IC05'
}

export function getItemCategoryCode( type: string) {
    switch(type) {
        case 'flight':
            return ItemCategoryCode.FLIGHT;
        break;
        case 'hotels':
            return ItemCategoryCode.HOTELS;
        break;
        case 'rent':
            return ItemCategoryCode.RENT;
        break;
        case 'activity':
            return ItemCategoryCode.ACTIVITY;
        break;
        case 'schedule':
            return ItemCategoryCode.SCHEDULE;
        break;            
        default:
          return ItemCategoryCode.FLIGHT;
    }
}