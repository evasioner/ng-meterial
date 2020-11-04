import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'weatherIcon'
})
export class WeatherIconPipe implements PipeTransform {

    /**
     * weatherIcon
     * 날씨 코드를 넣으면 해당 하는 아이콘 이름을 반환한다
     */
    transform(weatherCode: string): string {
        if (
            weatherCode === undefined ||
            weatherCode === null ||
            weatherCode === ''
        ) {
            return weatherCode;
        }

        return this.codeToText(weatherCode);
    }

    /**
     * codeToText
     * 날씨 코드를 아이콘 으로 변경
     */
    private codeToText(weatherCode: string): string {
        // 맑음
        // 구름조금
        // 흐림
        // 비
        // 눈
        // 눈비
        // 소나기
        // 소낙눈
        // 안개
        // 뇌우
        // 차차흐려짐
        // 12번 없음
        // 흐려져 비
        // 흐려져 눈
        // 흐려져 눈비
        // 흐린후 갬
        // 17번  없음
        // 비후갬
        // 눈후갬
        // 눈비후갬
        // 구름많음
        // 황사
        return {
            '1': 'ico-weather-sunny.png',
            '2': 'ico-weather-partly-sunny.png',
            '3': 'ico-weather-cloudy.png',
            '4': 'ico-weather-rain.png',
            '5': 'ico-weather-snow.png',
            '6': 'ico-weather-snow-rain-mixed.png',
            '7': 'ico-weather-heavy-rain.png',
            '8': 'ico-weather-heavy-snow.png',
            '9': 'ico-weather-fog.png',
            '10': 'ico-weather-thunderstorm.png',
            '11': 'ico-weather-to-cloudy.png',
            // '12': 'ico-weather-partly-sunny.png',
            '13': 'ico-weather-partly-sunny-shower.png',
            '14': 'ico-weather-partly-sunny-snow.png',
            '15': 'ico-weather-partly-sunny-snow-shower.png',
            '16': 'ico-weather-partly-after-sunny.png',
            // '17': 'ico-weather-rain-snow-mixed.png',
            '18': 'ico-weather-rain-sunny.png',
            '19': 'ico-weather-snow-sunny.png',
            '20': 'ico-weather-snow-rain-mixed-sunny.png',
            '21': 'ico-weather-heavy-cloudy.png',
            '22': 'ico-weather-sandstorm.png',
            // '23': 'ico-weather-thunderstorm.png',
            // '24': 'ico-weather-windy.png',
        }[weatherCode];
    }
}
