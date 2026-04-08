const http = require('http');

function trackEvent(eventType, eventData) {
    const payload = JSON.stringify({
        event_type: eventType,
        timestamp: new Date().toISOString(),
        data: eventData
    });

    const req = http.request({
        hostname: 'localhost',
        port: 3009,
        path: '/events',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': payload.length
        }
    });
    req.on('error', () => { /* Ingestion service down is ignored */ });
    req.write(payload);
    req.end();
}

module.exports = { trackEvent };
