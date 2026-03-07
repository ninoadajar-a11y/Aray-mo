// Access the camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    const video = document.getElementById("video");
    video.srcObject = stream;
    video.play();

  } catch (error) {
    console.error("Camera error:", error);
  }
}

// Start camera when page loads
window.onload = startCamera;
