export interface myReservationListPageVm {
  // 예약 목록 탭 | 0:전체, 1:항공, 2:호텔, 3:액티비티, 4:렌터카, 5:묶음할인
  selectCode: string;
  searchInfo: any; // 검색 조건
  rq: any;
  rs: any;

}
