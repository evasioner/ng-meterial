import { environment } from '@/environments/environment';

export interface Condition {
    stationTypeCode: string;
    currency: string;
    language: string;
    condition: any;
    transactionSetId?: string;
    selectCode?: string;
}

export const CondisionSet: Condition = {
    stationTypeCode: environment.STATION_CODE,
    currency: 'KRW',
    language: 'KO',
    condition: {}
};
