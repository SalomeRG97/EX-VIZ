// legal.js

document.addEventListener('DOMContentLoaded', () => {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            
            // Toggle active class
            if (item.classList.contains('active')) {
                item.classList.remove('active');
            } else {
                // Optional: close other accordions
                // document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });
});
