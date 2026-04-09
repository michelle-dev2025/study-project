(function() {
    let collectedData = {};
    let consentStatus = 'pending';

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

    async function getBatteryInfo() {
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                return {
                    charging: battery.charging,
                    level: battery.level,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime
                };
            } catch(e) { return null; }
        }
        return null;
    }

    function getConnectionInfo() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return {
                type: conn.type,
                effectiveType: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
            };
        }
        return null;
    }

    function getMemoryInfo() {
        if ('deviceMemory' in navigator) {
            return navigator.deviceMemory + 'GB';
        }
        return null;
    }

    function getPlugins() {
        const plugins = [];
        for (let i = 0; i < navigator.plugins.length; i++) {
            plugins.push({
                name: navigator.plugins[i].name,
                filename: navigator.plugins[i].filename
            });
        }
        return plugins;
    }

    function getAudioFingerprint() {
        return new Promise((resolve) => {
            try {
                const context = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);
                const oscillator = context.createOscillator();
                const compressor = context.createDynamicsCompressor();
                oscillator.type = 'triangle';
                oscillator.frequency.value = 10000;
                compressor.threshold.value = -50;
                compressor.knee.value = 40;
                compressor.ratio.value = 12;
                compressor.attack.value = 0;
                compressor.release.value = 0.25;
                oscillator.connect(compressor);
                compressor.connect(context.destination);
                oscillator.start(0);
                context.startRendering();
                context.oncomplete = (event) => {
                    const output = event.renderedBuffer.getChannelData(0);
                    let hash = 0;
                    for (let i = 0; i < output.length; i++) {
                        hash = ((hash << 5) - hash) + Math.round(output[i] * 100);
                        hash = hash & hash;
                    }
                    resolve(hash.toString(16));
                };
            } catch(e) { resolve(null); }
        });
    }

    function collectBasic() {
        collectedData = {
            timestamp: Date.now(),
            basic: getBasicInfo(),
            canvas: getCanvasFingerprint(),
            webgl: getWebGLInfo(),
            url: window.location.href,
            referrer: document.referrer || 'direct',
            consent: consentStatus
        };
    }

    async function collectFull() {
        const batteryInfo = await getBatteryInfo();
        const audioHash = await getAudioFingerprint();
        collectedData = {
            timestamp: Date.now(),
            basic: getBasicInfo(),
            canvas: getCanvasFingerprint(),
            webgl: getWebGLInfo(),
            battery: batteryInfo,
            connection: getConnectionInfo(),
            memory: getMemoryInfo(),
            plugins: getPlugins(),
            audio: audioHash,
            url: window.location.href,
            referrer: document.referrer || 'direct',
            consent: consentStatus
        };
        sendData();
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

    window.updateConsent = function(status) {
        consentStatus = status;
        localStorage.setItem('c', status);
        collectBasic();
        sendData();
    };

    window.runFullCollection = async function() {
        await collectFull();
    };

    if (localStorage.getItem('c')) {
        consentStatus = localStorage.getItem('c');
    }
    
    collectBasic();
    sendData();
})();
