/* Service 3 specific JS - Handles Modal data injection */

function openSpecModal(index) {
    const dataSource = document.getElementById(`popup-content-${index}`);
    const modalBody = document.getElementById('modalContentBody');
    
    if (dataSource && modalBody) {
        modalBody.innerHTML = dataSource.innerHTML;
    }

    currentMediaIndex = 0; // Reset
    renderModalCarousel(index);

    document.body.style.overflow = 'hidden';
    
    // Give browser time to load massive video elements into DOM before animating
    setTimeout(() => {
        document.getElementById('specModal').classList.add('active');
    }, 10);
}

function closeSpecModal() {
    document.getElementById('specModal').classList.remove('active');
    document.body.style.overflow = '';
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('specModal');
    if (e.target === modal) {
        closeSpecModal();
    }
});

/* INJECT MEDIA AND LIGHTBOX LOGIC */
let currentModalIndex = -1;
let currentMediaIndex = 0;

function renderModalCarousel(index) {
    currentModalIndex = index;
    const mediaContainer = document.querySelector(`#popup-content-${index} .popup-media-gallery`);
    const carouselContainer = document.querySelector('.carousel-placeholder');
    
    if (!mediaContainer || !carouselContainer) return;
    
    const mediaNodes = Array.from(mediaContainer.children);
    if (mediaNodes.length === 0) {
        carouselContainer.innerHTML = '';
        return;
    }
    
    const activeMedia = mediaNodes[currentMediaIndex].cloneNode(true);

    carouselContainer.innerHTML = '';
    
    const leftArrow = document.createElement('span');
    leftArrow.className = 'carousel-arrow left';
    leftArrow.innerHTML = '&lt;';
    leftArrow.onclick = prevModalMedia;
    
    const rightArrow = document.createElement('span');
    rightArrow.className = 'carousel-arrow right';
    rightArrow.innerHTML = '&gt;';
    rightArrow.onclick = nextModalMedia;

    carouselContainer.appendChild(leftArrow);
    carouselContainer.appendChild(activeMedia);
    carouselContainer.appendChild(rightArrow);
}

function prevModalMedia(e) {
    if(e) e.stopPropagation();
    const mediaContainer = document.querySelector(`#popup-content-${currentModalIndex} .popup-media-gallery`);
    if (!mediaContainer) return;
    const length = mediaContainer.children.length;
    currentMediaIndex = (currentMediaIndex - 1 + length) % length;
    renderModalCarousel(currentModalIndex);
}

function nextModalMedia(e) {
    if(e) e.stopPropagation();
    const mediaContainer = document.querySelector(`#popup-content-${currentModalIndex} .popup-media-gallery`);
    if (!mediaContainer) return;
    const length = mediaContainer.children.length;
    currentMediaIndex = (currentMediaIndex + 1) % length;
    renderModalCarousel(currentModalIndex);
}
