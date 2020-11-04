import { environment } from '@/environments/environment';

export interface Condition {
    itemCategoryCode: string;
}

export interface CalendarRq {
    condition: Condition;
    currency: string;
    language: string;
    stationTypeCode: string;
}

export const ConditionSet: Condition = {
    itemCategoryCode: 'IC04'
};

export const CalendarRqSet: CalendarRq = {
    condition: ConditionSet,
    currency: 'KRW',
    language: 'KO',
    stationTypeCode: environment.STATION_CODE
};