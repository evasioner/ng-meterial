import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class ActivityComServiceService {

    constructor() { }

    /**
     * 액티비티 RQ 중 filter들의 object -> string 변환.
     * URL 길이 줄이기 용.
     * @param $rqObj RQ
     */
    beforeEncodingRq($rqObj) {
        const returnObj = $rqObj;

        // rq.condition.filter 
        if (_.has(returnObj.rq.condition, 'filter')) {
            const tmpFilter = _.cloneDeep(returnObj.rq.condition.filter);
            const returnFilter = _.omitBy(
                tmpFilter,
                [
                    'amount',
                    'reviewAverage',
                    'paxCount',
                    'duration',
                    'tags',
                    'deliveryTypes',
                    'categories',
                    'continents',
                    'guide',
                    'languages'
                ]
            );


            if (_.has(tmpFilter, 'amount')) {
                returnFilter.amount = _.join([tmpFilter.amount.lowestAmount, tmpFilter.amount.highestAmount]);
            }

            if (_.has(tmpFilter, 'reviewAverage')) {
                returnFilter.reviewAverage = _.join([tmpFilter.reviewAverage.minimum, tmpFilter.reviewAverage.maximum]);
            }

            if (_.has(tmpFilter, 'paxCount')) {
                returnFilter.paxCount = _.join([tmpFilter.paxCount.adult, tmpFilter.paxCount.child]);
            }

            if (_.has(tmpFilter, 'duration')) {
                returnFilter.duration = _.join([tmpFilter.duration.minimum, tmpFilter.duration.maximum]);
            }

            if (_.has(tmpFilter, 'tags')) {
                returnFilter.tags = _.join(_.map(tmpFilter.tags, 'code'));
            }

            if (_.has(tmpFilter, 'deliveryTypes')) {
                returnFilter.deliveryTypes = _.join(_.map(tmpFilter.deliveryTypes, 'code'));
            }

            if (_.has(tmpFilter, 'guide')) {
                returnFilter.guide = (tmpFilter.guide === 'true');
            }

            if (_.has(tmpFilter, 'languages')) {
                returnFilter.languages = _.join(_.map(tmpFilter.languages, 'code'));
            }

            if (_.has(tmpFilter, 'categories')) {
                returnFilter.categories = this.flattenCategory(tmpFilter.categories);
            }

            if (_.has(tmpFilter, 'continents')) {
                returnFilter.continents = this.flattenCity(tmpFilter.continents);
            }

            returnObj.rq.condition.filter = returnFilter;
        }

        return returnObj;
    }

    flattenCategory(obj) {
        const result = _.chain(obj)
            .map(s => {
                if (s.types) {
                    return s.code + ':' + _.join(_.map(s.types, 'code'));
                } else {
                    return s.code;
                }
            })
            .join('!')
            .value();

        return result;
    }

    flattenCity(obj) {
        const flat1Dept = _.flatMap(obj, ({ code, countries }) => // keyName(code, countries)고정값
            _.map(countries, item => ({ 'code_1dept': code, ...item }))
        );

        const flat2Dept = _.flatMap(flat1Dept, ({ code_1dept, code, cities }) => // keyName(code_1dept, code, cities)고정값
            _.map(cities, item => ({ 'key': code_1dept + '_' + code, ...item }))
        ); // result : [{key: "UN_US", code: "USLAS"}]

        return _.chain(flat2Dept)
            .groupBy('key')
            .map((value, key) => (key + ':' + _.join(_.map(value, 'code'))))
            .join('!')
            .value();
        // result : AS_PH:PHSFS,PHMNL!AS_SG:SGSIN
    }

    /**
     * 액티비티 RQ를 형변환/string-> object 변환
     * @param $rqObj RQ
     */
    afterEncodingRq($rqObj) {
        const returnObj = $rqObj;

        // rq.condition.limits
        if (_.has(returnObj.rq.condition, 'limits')) {
            returnObj.rq.condition.limits = _.chain(returnObj)
                .get('rq.condition.limits')
                .value()
                .map((o) => {
                    return Number(o);
                });

        }

        // rq.condition.activityCode
        if (_.has(returnObj.rq.condition, 'activityCode')) {
            returnObj.rq.condition.activityCode = Number(returnObj.rq.condition.activityCode);
        }

        // rq.condition.filter 
        if (_.has(returnObj.rq.condition, 'filter')) {
            const tmpFilter = _.cloneDeep(returnObj.rq.condition.filter);
            const returnFilter = _.omitBy(
                tmpFilter,
                [
                    'amount',
                    'reviewAverage',
                    'paxCount',
                    'duration',
                    'tags',
                    'deliveryTypes',
                    'categories',
                    'continents',
                    'guide',
                    'languages'
                ]
            );

            if (_.has(tmpFilter, 'amount')) { // 'amount' in tmpFilter
                returnFilter.amount = _.zipObject(
                    ['lowestAmount', 'highestAmount'],
                    _.split(tmpFilter.amount, ',')
                        .map((o) => {
                            return Number(o);
                        })
                );
            }

            if (_.has(tmpFilter, 'reviewAverage')) {
                returnFilter.reviewAverage = _.zipObject(
                    ['minimum', 'maximum'],
                    _.split(tmpFilter.reviewAverage, ',')
                        .map((o) => {
                            return Number(o);
                        })
                );
            }

            if (_.has(tmpFilter, 'paxCount')) {
                returnFilter.paxCount = _.zipObject(
                    ['adult', 'child'],
                    _.split(tmpFilter.paxCount, ',')
                        .map((o) => {
                            return Number(o);
                        })
                );
            }

            if (_.has(tmpFilter, 'duration')) {
                returnFilter.duration = _.zipObject(
                    ['minimum', 'maximum'],
                    _.split(tmpFilter.duration, ',')
                        .map((o) => {
                            return Number(o);
                        })
                );
            }

            if (_.has(tmpFilter, 'tags')) {
                returnFilter.tags = _.map(_.split(tmpFilter.tags, ','), ($item) => {
                    return { 'code': $item };
                });
            }

            if (_.has(tmpFilter, 'deliveryTypes')) {
                returnFilter.deliveryTypes = _.map(_.split(tmpFilter.deliveryTypes, ','), ($item) => {
                    return { 'code': $item };
                });
            }

            if (_.has(tmpFilter, 'guide')) {
                returnFilter.guide = (tmpFilter.guide === 'true');
            }

            if (_.has(tmpFilter, 'languages')) {
                returnFilter.languages = _.map(_.split(tmpFilter.languages, ','), ($item) => {
                    return { 'code': $item };
                });
            }

            if (_.has(tmpFilter, 'categories')) {
                returnFilter.categories = this.unFlattenCategory(tmpFilter.categories);
            }

            if (_.has(tmpFilter, 'continents')) {
                returnFilter.continents = this.unFlattenCity(tmpFilter.continents);
            }

            returnObj.rq.condition.filter = returnFilter;
        }

        return returnObj;
    }

    unFlattenCategory($obj) {
        return _.chain($obj)
            .split('!')
            .map(s => _.zipObject(['key', 'code'], s.split(':')))
            .map(s => {
                if (s.code) {
                    const tmpCode = s.code.split(',');
                    return {
                        'code': s.key,
                        'types': _.map(tmpCode, (s1) => { return { 'code': s1 }; })
                    };
                } else {
                    return { 'code': s.key };
                }
            })
            .value();
    }

    unFlattenCity($obj) {
        const result1 = _.chain($obj)
            .split('!')
            .map(s => _.zipObject(['key', 'code'], s.split(':')))
            .map(obj => {
                const tmpCode = obj.code.split(',');
                const tmpKey = obj.key.split('_');
                return _.map(tmpCode, (s) => {
                    return {
                        'code_1dept': tmpKey[0],
                        'code_2dept': tmpKey[1],
                        'code': s
                    };
                });
            })
            .flatten()
            .value();
        // result : [{code_1dept: "UN", code_2dept: "US", code: "USLAS"}]

        const returnObj = _.chain(result1)
            .groupBy('code_1dept')
            .mapValues(values => _.chain(values)
                .groupBy('code_2dept')
                .map((value, key) => ({
                    'code': key, 'cities': _.map(value, ($item) => {
                        return { 'code': $item.code };
                    })
                }))
                .value()
            )
            .map((value, key) => ({ 'code': key, 'countries': value }))
            .value();

        return returnObj;
    }
}
