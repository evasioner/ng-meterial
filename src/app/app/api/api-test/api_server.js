const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 9999;

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    /* common ---------------------------------------- */
    if (req.url === '/common/calendar') {					// 달력
        fs.readFile(__dirname + '/json/calendar.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/common/destination') {			// 목적지 검색
        fs.readFile(__dirname + '/json/destination_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/common/majorDestination') {		// 주요 목적지
        fs.readFile(__dirname + '/json/majorDestination_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/common/term') {		// 약관조회
        fs.readFile(__dirname + '/json/terms_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    }
    /* flight ---------------------------------------- */
    if (req.url === '/flight/list/itinerary') {		// 스케줄 상세, 정렬, 상세조건, 카드 목록 => ?항공검색
        fs.readFile(__dirname + '/json/listItinerary_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/flight/segHold') {		// 항공 세그 홀드
        //- 서비스API 목록에 없음.
        fs.readFile(__dirname + '/json/segHold_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/flight/booking') {		// 항공 운임 규정 RQ? 항공 부킹?  => 항공 예약하기
        fs.readFile(__dirname + '/json/fareRule_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/flight/list/all') {		// 알수 없음.
        // 서비스API 목록에 없음.
        fs.readFile(__dirname + '/json/listAll_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    }
    /* hotel ---------------------------------------- */
    if (req.url === '/hotel/list') {                   // 호텔 검색후 리스트
        fs.readFile(__dirname + '/json/hotel_list.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });

    } else if (req.url === '/hotel/information') {                 // 호텔 상세
        // url /hotel/detail => /hotel/information  변경함.
        fs.readFile(__dirname + '/json/information_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/hotel/room/list') {              // 호텔 객실 검색 리스트
        fs.readFile(__dirname + '/json/roomList_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/hotel/stats') {                  // 호텔 현재 상태 조회(몇명이 예약하고 보고 있는지...)
        fs.readFile(__dirname + '/json/hotel_stats_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/hotel/basket') {                   // 호텔 위시에 추가
        fs.readFile(__dirname + '/json/hotel_basket_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/hotel/room/condition') {         // 호텔 룸 서비스 요금
        // ? 호텔 취소수수료 정책
        fs.readFile(__dirname + '/json/roomCondition_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    }

    /* booking ---------------------------------------- */
    if (req.url === '/booking') {
        // 호텔 예약 결과.
        fs.readFile(__dirname + '/json/booking_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/booking/cancel') {
        // 호텔 취소 결과
        fs.readFile(__dirname + '/json/bookingCancel_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/booking/traveler') {
        // 알수 없음. 내부 "serviceName": "hotel/wish" 잘못 표기됨.
        fs.readFile(__dirname + '/json/traveler_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '') {
        res.end(JSON.stringify());
    } else if (req.url === '') {
        res.end(JSON.stringify());
    } else if (req.url === '') {
        res.end(JSON.stringify());
    } else if (req.url === '') {
        res.end(JSON.stringify());
    } else if (req.url === '') {
        res.end(JSON.stringify());
    }
    /* 렌터카 ---------------------------------------- */
    if (req.url === '/car') {
        fs.readFile(__dirname + '/json/car.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/rent/list') {
        // 렌터카 검색
        fs.readFile(__dirname + '/json/rent_list_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/rent/rentRule') {
        // 렌터카 취소수수료 정책
        fs.readFile(__dirname + '/json/rentRule_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    }

    /* 액티비티 ---------------------------------------- */
    if (req.url === '/activity/list') { // 액티비티 검색
        fs.readFile(__dirname + '/json/activity_list_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/activity/option') { // 액티비티 검색 상세
        fs.readFile(__dirname + '/json/activity_option_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    }

    /* 마이페이지 ---------------------------------------- */
    if (req.url === '/booking/hotel/detail') {
        fs.readFile(__dirname + '/json/my_reservation_hotel_detail', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    }


    /*  user ---------------------------------------- */
    if (req.url === '/user/login') {
        fs.readFile(__dirname + '/json/login_sample.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    } else if (req.url === '/user/getInfo') {  // 사용자 정보 RQ
        fs.readFile(__dirname + '/json/getInfo_sample_rs.json', 'utf8', (err, data) => {
            res.end(JSON.stringify(JSON.parse(data)));
        });
    }


});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
