/* ============================================================
   contact.js – EX-VIZ Multi-step form with EmailJS submission
   ============================================================
   SETUP:
   1. Create a free account at https://www.emailjs.com
   2. Connect your Email Service (Gmail, Outlook, etc.) → copy Service ID
   3. Create an Email Template with:
        Subject:  {{subject}}
        Reply To: {{from_email}}
        Body:     {{{email_body}}}   ← three braces for HTML rendering
      → copy Template ID
   4. Copy your Public Key from Account → API Keys
   5. Replace the three values in EMAILJS_CONFIG below
   ============================================================ */

(function () {
    'use strict';

    // ============================================================
    // ⚙️  CONFIG — EmailJS
    // ============================================================
    const EMAILJS_CONFIG = {
        publicKey:  'aWcCKXvPAVypqGz0P',   // ← Your EmailJS Public Key
        serviceId:  'service_uf6dbfm',   // ← e.g. 'service_xxxxxx'
        templateId: 'template_z20di2a'   // ← e.g. 'template_xxxxxx'
    };

    // Page tag used in the email subject
    const PAGE_TAG = 'EX-VIZ';

    // ============================================================
    // DOM References
    // ============================================================
    const step1      = document.getElementById('step-1');
    const step2      = document.getElementById('step-2');
    const pillStep1  = document.getElementById('pill-1');
    const pillStep2  = document.getElementById('pill-2');
    const btnNext    = document.getElementById('btn-next');
    const btnPrev    = document.getElementById('btn-prev');
    const btnSubmit  = document.getElementById('btn-submit');
    const formEl     = document.getElementById('contact-form');
    const successEl  = document.getElementById('form-success');

    if (!formEl) return;

    // ============================================================
    // STEP NAVIGATION
    // ============================================================
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

    // ============================================================
    // VALIDATION HELPERS
    // ============================================================
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

    function validateStep2() {
        const checks = [
            required('contact-reason'),
            required('project-notes'),
        ];
        return checks.every(Boolean);
    }

    // ============================================================
    // FORM SUBMISSION — EmailJS
    // ============================================================
    formEl.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateStep2()) return;

        btnSubmit.disabled = true;
        btnSubmit.textContent = '...';

        const firstName   = document.getElementById('first-name').value.trim();
        const lastName    = document.getElementById('last-name').value.trim();
        const phoneCode   = document.getElementById('phone-code').value;
        const phoneNumber = document.getElementById('phone-number').value.trim();
        const email       = document.getElementById('email').value.trim();
        const company     = document.getElementById('company').value.trim();
        const reason      = document.getElementById('contact-reason').value;
        const notes       = document.getElementById('project-notes').value.trim();
        const fecha       = new Date().toLocaleString('es-CO', {
            timeZone: 'America/Bogota',
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        // Dynamic subject: [EX-VIZ] - Reason selected
        const subject = `[${PAGE_TAG}] - ${reason}`;

        // Structured HTML email body
        const emailBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #001F3A 0%, #003366 100%); padding: 28px 32px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 22px; margin: 0 0 4px; letter-spacing: 1px; }
    .header p { color: #7eceff; font-size: 13px; margin: 0; }
    .badge { display: inline-block; background: #00a86b; color: #fff; font-size: 12px; font-weight: bold; padding: 4px 14px; border-radius: 20px; margin-top: 10px; }
    .body { padding: 28px 32px; }
    .field { margin-bottom: 18px; border-bottom: 1px solid #eeeeee; padding-bottom: 14px; }
    .field:last-child { border-bottom: none; }
    .label { font-size: 11px; text-transform: uppercase; color: #888888; letter-spacing: 0.8px; margin-bottom: 4px; }
    .value { font-size: 15px; color: #222222; font-weight: 500; }
    .msg-box { background: #f7f9fc; border-left: 4px solid #00a86b; padding: 14px 16px; border-radius: 0 6px 6px 0; font-size: 14px; color: #333; line-height: 1.6; white-space: pre-wrap; }
    .footer { background: #f4f4f4; padding: 16px 32px; text-align: center; font-size: 12px; color: #aaaaaa; }
    .footer strong { color: #555; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>EX-VIZ</h1>
      <p>New contact request received from <strong style="color:#fff">EX-VIZ</strong></p>
      <span class="badge">${reason}</span>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Full Name</div>
        <div class="value">${firstName} ${lastName}</div>
      </div>
      <div class="field">
        <div class="label">Email Address</div>
        <div class="value">${email}</div>
      </div>
      <div class="field">
        <div class="label">Phone</div>
        <div class="value">${phoneCode} ${phoneNumber}</div>
      </div>
      <div class="field">
        <div class="label">Company / Organization</div>
        <div class="value">${company}</div>
      </div>
      <div class="field">
        <div class="label">Reason for Contact</div>
        <div class="value">${reason}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="msg-box">${notes}</div>
      </div>
      <div class="field" style="border-bottom:none;">
        <div class="label">Submission Date & Time (Colombia)</div>
        <div class="value">${fecha}</div>
      </div>
    </div>
    <div class="footer">
      <strong>EX-VIZ | An EBEDIX Company | All rights reserved</strong><br>
      EX-View &middot; EX-View Solar &middot; EX-VIZ
    </div>
  </div>
</body>
</html>`;

        sendEmail({ subject, from_name: `${firstName} ${lastName}`, from_email: email, email_body: emailBody });
    });

    // ============================================================
    // SEND VIA EmailJS
    // ============================================================
    function sendEmail(params) {
        if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
            emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                params,
                EMAILJS_CONFIG.publicKey
            )
            .then(() => {
                showSuccess();
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                alert('Something went wrong. Please try again or contact us directly at info@ebedix.com');
                btnSubmit.disabled = false;
                btnSubmit.textContent = btnSubmit.dataset.label || 'Send';
            });
        } else {
            // EmailJS not configured — simulate success for local dev
            console.warn('⚠️  EmailJS not configured. Fill in EMAILJS_CONFIG in contact.js to enable real sending.');
            console.info('Data that would be sent:', params);
            setTimeout(showSuccess, 1500);
        }
    }

    // ============================================================
    // SUCCESS STATE
    // ============================================================
    function showSuccess() {
        formEl.style.display = 'none';
        successEl.classList.add('visible');
    }

    // ============================================================
    // CLEAR ERRORS ON INPUT
    // ============================================================
    formEl.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', () => el.classList.remove('error'));
    });

    // ============================================================
    // LOAD EmailJS SDK DYNAMICALLY
    // ============================================================
    function loadEmailJSSDK() {
        if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
            console.info('ℹ️  EmailJS: Not configured. Fill EMAILJS_CONFIG in contact.js to enable real email sending.');
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.async = true;
        script.onload = function () {
            if (typeof emailjs !== 'undefined') {
                emailjs.init(EMAILJS_CONFIG.publicKey);
                console.info('✅ EmailJS initialized successfully.');
            }
        };
        document.head.appendChild(script);
    }

    loadEmailJSSDK();

})();
