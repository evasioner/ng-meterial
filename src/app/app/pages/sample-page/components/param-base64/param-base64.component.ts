import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UtilBase64Service } from '@/app/common-source/services/util-base64/util-base64.service';

@Component({
    selector: 'app-param-base64',
    templateUrl: './param-base64.component.html',
    styleUrls: ['./param-base64.component.scss']
})
export class ParamBase64Component implements OnInit {

    public paramData: any;
    private route: ActivatedRoute;

    tempObj = {
        id: 382947,
        name: 'apple',
        list: [
            {
                itme_id: 1,
                item_name: 'aaaa'
            },
            {
                itme_id: 2,
                item_name: 'bbbb'
            }
        ]
    };

    output0: any;
    output1: any;

    constructor(
        route: ActivatedRoute,
        private base64Svc: UtilBase64Service
    ) {
        this.route = route;
    }

    ngOnInit() {
        this.paramData = this.route.snapshot.queryParams;
        console.info('[paramData]', this.paramData);
    }

    /**
     * 1. json object -> string | jsonToString
     * 2. string -> base64Encoding
     * 3. base64Encoding -> base64Decoding
     * 4. string -> object
     */

    base64EncodingFun($obj: any) {
        return this.base64Svc.base64EncodingFun($obj);
    }

    base64DecodingFun($str) {
        return this.base64Svc.base64DecodingFun($str);
    }


    /**
     * base64 인코딩
     * @param $str
     */
    base64Encoding($str: string): string {
        return this.base64Svc.base64Encoding($str);
    }


    /**
     * base64 디코딩
     * @param $str
     */
    base64Decoding($str: string): string {
        return this.base64Svc.base64Decoding($str);
    }

    /**
     * object -> string
     * @param $obj
     */
    jsonToString($obj: any): string {
        return JSON.stringify($obj);
    }

    /**
     * string  -> object
     * @param $str
     */
    stringToJson($str: string): any {
        return JSON.parse($str);
    }


}
