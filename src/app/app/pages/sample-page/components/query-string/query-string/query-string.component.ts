import {Component, OnInit} from '@angular/core';
import * as qs from 'qs';

@Component({
    selector: 'app-query-string',
    templateUrl: './query-string.component.html',
    styleUrls: ['./query-string.component.scss']
})
export class QueryStringComponent implements OnInit {

    testObj = {
        chains: [
            {
                "code": "0",
                "brands": [
                    {
                        "code": "1"
                    }
                ]
            },
            {
                "code": "10",
                "brands": [
                    {
                        "code": "20"
                    }
                ]
            }
        ]
    };

    testObj2 = {
        rooms: '1^2^1@2@3/1^2^1@2@3/1^2^1@2@3/1^2^1@2@3/1^2^1@2@3'
    };

    constructor() {
    }

    ngOnInit(): void {
        const incodingOpt = {
            // encode: false,
            // encodeValuesOnly: true
        };
        const incoding = qs.stringify(this.testObj, incodingOpt);

        console.info('[qs test > incoding]', incoding);

        const decodingOpt = {};

        const decoding = qs.parse(incoding, decodingOpt);

        console.info('[qs test > decoding]', decoding);
    }


}
