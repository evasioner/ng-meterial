import { environment } from '@/environments/environment';

export interface Script {
    name: string;
    src: string;
}

export const ScriptsSet: Script[] = [
    { name: 'inicis', src: environment.inicisPayUrl }
];

