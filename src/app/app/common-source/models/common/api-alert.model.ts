export interface AlertButton {
    name?: string;
    fun();
}

/**
 * CommonApiAlert
 * api 오류 시 알럿 서비스
 *
 * @var titleTxt 진한 검은 글씨
 * @var alertHtml 아래의 회색 작은 글씨
 * @var okObj ok 버튼 표시
 * @var closeObj 우측 상단 닫기 버튼 표시
 * @var cancelObj 취소 버튼 표시
 */
export interface ApiAlert {
    titleTxt: string;
    alertHtml?: string;
    okObj?: AlertButton;
    closeObj?: AlertButton;
    cancelObj?: AlertButton;
}