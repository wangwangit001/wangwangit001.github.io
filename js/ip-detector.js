// 检测是否为中国大陆IP
async function isChineseMainlandIP() {
    try {
        // 使用免费API检测IP地区
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        // 检查国家代码是否为CN(中国)
        return data.country_code === 'CN';
    } catch (error) {
        console.error('IP检测失败:', error);
        // 检测失败时默认返回false，即允许显示广告
        return false;
    }
}

// 将检测结果存储到localStorage中，避免频繁请求
async function checkAndStoreIPStatus() {
    // 检查是否已有缓存结果及其是否在24小时内
    const stored = localStorage.getItem('isChineseIP');
    const timestamp = localStorage.getItem('ipCheckTime');
    const now = Date.now();

    // 如果有缓存且未过期(24小时内)
    if (stored !== null && timestamp && now - parseInt(timestamp) < 24 * 60 * 60 * 1000) {
        return stored === 'true';
    }

    // 重新检测IP
    const isChineseIP = await isChineseMainlandIP();

    // 存储结果和时间戳
    localStorage.setItem('isChineseIP', isChineseIP);
    localStorage.setItem('ipCheckTime', now.toString());

    return isChineseIP;
}

// 导出为全局变量供其他脚本使用
window.ipDetector = {
    checkAndStoreIPStatus: checkAndStoreIPStatus
};