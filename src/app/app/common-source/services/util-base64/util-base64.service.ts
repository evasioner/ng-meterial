import { Injectable } from '@angular/core';
import { Base64 } from 'js-base64';

@Injectable({
    providedIn: 'root'
})
export class UtilBase64Service {

    constructor() {
    }

    /**
     * 1. json object -> string | jsonToString
     * 2. string -> base64Encoding
     * 3. base64Encoding -> base64Decoding
     * 4. string -> object
     */

    base64EncodingFun($obj: any): string {
        const temp0 = this.jsonToString($obj);
        const temp1 = this.base64Encoding(temp0);
        return temp1;
    }

    base64DecodingFun($str: string): any {
        const temp0 = this.base64Decoding($str);
        const temp1 = this.stringToJson(temp0);
        return temp1;
    }


    /**
     * base64 인코딩
     * @param $str
     */
    base64Encoding($str: string): string {
        return Base64.encodeURI($str);
    }

    /**
     * base64 디코딩
     * @param $str
     */
    base64Decoding($str: string): string {
        return Base64.decode($str);
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
