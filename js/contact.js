/* ============================================================
   contact.js – Multi-step form with email submission
   ============================================================ */

(function () {
    'use strict';

    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xgorebkv';

    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const pillStep1 = document.getElementById('pill-1');
    const pillStep2 = document.getElementById('pill-2');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const btnSubmit = document.getElementById('btn-submit');
    const formEl = document.getElementById('contact-form');
    const successEl = document.getElementById('form-success');

    if (!formEl) return;

    /* ---- Step navigation ---- */
    btnNext && btnNext.addEventListener('click', () => {
        if (validateStep1()) goToStep(2);
    });

    btnPrev && btnPrev.addEventListener('click', () => goToStep(1));

    function goToStep(n) {
        if (n === 1) {
            step1.classList.add('active');
            step2.classList.remove('active');
            pillStep1.className = 'step-pill active';
            pillStep2.className = 'step-pill pending';
        } else {
            step1.classList.remove('active');
            step2.classList.add('active');
            pillStep1.className = 'step-pill done';
            pillStep2.className = 'step-pill active';
        }
    }

    /* ---- Validation helpers ---- */
    function required(id) {
        const el = document.getElementById(id);
        if (!el) return true;
        const ok = el.value.trim() !== '';
        el.classList.toggle('error', !ok);
        return ok;
    }

    function validEmail(id) {
        const el = document.getElementById(id);
        if (!el) return true;
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
        el.classList.toggle('error', !ok);
        return ok;
    }

    function validateStep1() {
        const checks = [
            required('first-name'),
            required('last-name'),
            required('phone-number'),
            required('phone-code'),
            validEmail('email'),
            required('company'),
        ];
        return checks.every(Boolean);
    }

    /* ---- Form submission ---- */
    formEl.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!document.getElementById('project-notes').value.trim()) {
            document.getElementById('project-notes').classList.add('error');
            return;
        }

        btnSubmit.disabled = true;
        btnSubmit.textContent = '...';

        const data = {
            firstName: document.getElementById('first-name').value.trim(),
            lastName: document.getElementById('last-name').value.trim(),
            phone: document.getElementById('phone-code').value + ' ' + document.getElementById('phone-number').value.trim(),
            email: document.getElementById('email').value.trim(),
            company: document.getElementById('company').value.trim(),
            notes: document.getElementById('project-notes').value.trim(),
        };

        try {
            const res = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    _replyto: data.email,
                    _subject: `New EX-VIZ Contact from ${data.firstName} ${data.lastName} – ${data.company}`,
                    ...data,
                }),
            });

            if (res.ok) {
                formEl.style.display = 'none';
                successEl.classList.add('visible');
            } else {
                throw new Error('Server error');
            }
        } catch {
            alert('Something went wrong. Please try again or contact us directly.');
            btnSubmit.disabled = false;
            btnSubmit.textContent = btnSubmit.dataset.label || 'Send';
        }
    });

    /* ---- Clear error on input ---- */
    formEl.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', () => el.classList.remove('error'));
    });

})();
