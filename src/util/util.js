/**
 * 判断设备类型
 * @return {object} 设备判别方法
 */
export function checkDeviceType() {
    let checkFunc = {
        android() {
            return navigator.userAgent.match(/Android/i);
        },
        blackBerry() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        winphone() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        mobile() {
            return navigator.userAgent.match(/Mobile/i);
        },
        ipad() {
            return navigator.userAgent.match(/iPad/i);
        },
        androidPad() {
            var isAndroid = checkFunc.android();
            var isMobile = navigator.userAgent.match(/Mobile/i);
            return isAndroid && !isMobile;
        },
        phone() {
            return (
                checkFunc.mobile() &&
                !checkFunc.ipad() &&
                !checkFunc.androidPad()
            );
        },
        pc() {
            return (
                !checkFunc.mobile() &&
                !checkFunc.ipad() &&
                !checkFunc.androidPad()
            );
        },
        devMode() {
            return (
                location.hostname.indexOf('127.0.0') > -1 ||
                location.hostname.indexOf('192.168') > -1
            );
        }
    };

    var device = {
        android: checkFunc.android(),
        blackBerry: checkFunc.blackBerry(),
        iOS: checkFunc.iOS(),
        winphone: checkFunc.winphone(),
        ipad: checkFunc.ipad(),
        androidPad: checkFunc.androidPad(),
        mobile: checkFunc.mobile(),
        phone: checkFunc.phone(),
        pc: checkFunc.pc(),
        devMode: checkFunc.devMode()
    };

    return device;
}