document.addEventListener('DOMContentLoaded', () => {
    const uploadTrigger = document.getElementById('upload-trigger');
    const verifyModal = document.getElementById('verify-modal');
    const verifyHandle = document.getElementById('verify-handle');
    const verifyContainer = document.getElementById('verify-container');
    const fileInput = document.getElementById('file-input');
    const galleryGrid = document.getElementById('gallery-grid');

    let isDragging = false;
    let startX = 0;
    let containerWidth = verifyContainer.offsetWidth;
    let handleWidth = verifyHandle.offsetWidth;
    let maxDistance = containerWidth - handleWidth - 10; // 5px padding on each side

    // --- Anti-Bot Verification Logic ---

    uploadTrigger.addEventListener('click', () => {
        verifyModal.style.display = 'flex';
        resetSlider();
    });

    verifyHandle.addEventListener('mousedown', startDrag);
    verifyHandle.addEventListener('touchstart', startDrag);

    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag);

    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);

    function startDrag(e) {
        isDragging = true;
        startX = (e.type === 'mousedown') ? e.clientX : e.touches[0].clientX;
        verifyHandle.style.transition = 'none';
    }

    function drag(e) {
        if (!isDragging) return;
        
        const currentX = (e.type === 'mousemove') ? e.clientX : e.touches[0].clientX;
        let delta = currentX - startX;
        
        if (delta < 0) delta = 0;
        if (delta > maxDistance) delta = maxDistance;

        verifyHandle.style.left = (delta + 5) + 'px';
        
        // Success condition
        if (delta >= maxDistance - 2) {
            handleSuccess();
        }
    }

    function stopDrag() {
        if (!isDragging) return;
        isDragging = false;
        
        const currentLeft = parseInt(verifyHandle.style.left);
        if (currentLeft < maxDistance) {
            resetSlider();
        }
    }

    function resetSlider() {
        verifyHandle.style.transition = 'left 0.3s ease';
        verifyHandle.style.left = '5px';
    }

    function handleSuccess() {
        isDragging = false;
        verifyModal.style.display = 'none';
        fileInput.click(); // Trigger file selection
    }

    // --- Mock Upload Logic ---

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const isVideo = file.type.startsWith('video/');
        
        if (isVideo) {
            try {
                const duration = await getVideoDuration(file);
                if (duration > 15) {
                    alert("Video is too long! Please limit uploads to 15 seconds.");
                    return;
                }
                const url = URL.createObjectURL(file);
                addVideoToGallery(url);
            } catch (err) {
                alert("Error processing video.");
            }
        } else {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgUrl = event.target.result;
                addImageToGallery(imgUrl);
            };
            reader.readAsDataURL(file);
        }
    });

    function getVideoDuration(file) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                resolve(video.duration);
            };
            video.onerror = () => reject("Error loading video metadata");
            video.src = URL.createObjectURL(file);
        });
    }

    function addImageToGallery(url) {
        const img = document.createElement('img');
        img.src = url;
        img.alt = "Uploaded Soccer Picture";
        img.className = 'thumb';
        animateNewItem(img);
    }

    function addVideoToGallery(url) {
        const video = document.createElement('video');
        video.src = url;
        video.className = 'thumb';
        video.muted = true;
        video.loop = true;
        video.onmouseover = () => video.play();
        video.onmouseout = () => video.pause();
        animateNewItem(video);
    }

    function animateNewItem(el) {
        el.style.opacity = '0';
        el.style.transform = 'scale(0.8)';
        galleryGrid.prepend(el);
        
        setTimeout(() => {
            el.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
        }, 10);
    }

    // --- Close Modal on Outside Click ---
    window.addEventListener('click', (e) => {
        if (e.target === verifyModal) {
            verifyModal.style.display = 'none';
        }
    });

    // --- Dynamic News Feed (Mock) ---
    // In a real app, this would fetch from an API
    console.log("Soccer Site Initialized - Anti-Bot Security Active");
});
