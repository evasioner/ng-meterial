export interface UrlModel {
    target: string;
    text: string;
}

export const UrlModelList: UrlModel[] = [
    { target: '/flight', text: '항공' },
    { target: '/hotel', text: '호텔' },
    { target: '/rent', text: '렌터카' },
    { target: '/activity', text: '액티비티' }
];
