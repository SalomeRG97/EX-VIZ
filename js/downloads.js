/* ============================================================
   downloads.js – EX-VIZ Download Lead Form Modal & Automatic PDF Trigger
   ============================================================ */

(function () {
    'use strict';

    // EmailJS Configuration (Matching contact.js)
    const EMAILJS_CONFIG = {
        publicKey:  'aWcCKXvPAVypqGz0P',
        serviceId:  'service_uf6dbfm',
        templateId: 'template_z20di2a'
    };

    // Load / Init EmailJS SDK if available
    function initEmailJS() {
        if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey) {
            emailjs.init(EMAILJS_CONFIG.publicKey);
        } else if (typeof emailjs === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
            script.async = true;
            script.onload = function () {
                if (typeof emailjs !== 'undefined') {
                    emailjs.init(EMAILJS_CONFIG.publicKey);
                }
            };
            document.head.appendChild(script);
        }
    }

    initEmailJS();

    runAfterDOMContentLoaded(() => {
        const downloadModal = document.getElementById('downloadModal');
        const closeDownloadModal = document.getElementById('closeDownloadModal');
        const downloadForm = document.getElementById('download-lead-form');
        const downloadSuccessMsg = document.getElementById('download-success-msg');
        const pdfUrlInput = document.getElementById('download-pdf-url');
        const docTitleInput = document.getElementById('download-doc-title');
        const docTitleDisplay = document.getElementById('downloadModalDocTitle');
        const downloadBtns = document.querySelectorAll('.download-pdf-btn');

        if (!downloadModal) return;

        // Validation helpers
        function validateInput(id) {
            const el = document.getElementById(id);
            if (!el) return true;
            const isValid = el.value.trim() !== '';
            el.classList.toggle('error', !isValid);
            return isValid;
        }

        function validateEmailInput(id) {
            const el = document.getElementById(id);
            if (!el) return true;
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
            el.classList.toggle('error', !isValid);
            return isValid;
        }

        // Open Modal on Clicking "Descargar PDF" / "Download PDF"
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const pdfPath = btn.getAttribute('data-pdf') || '';
                const docTitle = btn.getAttribute('data-title') || 'Documento PDF';

                if (pdfUrlInput) pdfUrlInput.value = pdfPath;
                if (docTitleInput) docTitleInput.value = docTitle;
                if (docTitleDisplay) docTitleDisplay.textContent = docTitle;

                // Reset form and UI
                if (downloadForm) {
                    downloadForm.style.display = 'block';
                    downloadForm.reset();
                    const inputs = downloadForm.querySelectorAll('.error');
                    inputs.forEach(i => i.classList.remove('error'));
                }
                if (downloadSuccessMsg) {
                    downloadSuccessMsg.style.display = 'none';
                }

                // Open Modal
                downloadModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close Modal Logic
        const closeModal = () => {
            downloadModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeDownloadModal) {
            closeDownloadModal.addEventListener('click', closeModal);
        }

        downloadModal.addEventListener('click', (e) => {
            if (e.target === downloadModal) {
                closeModal();
            }
        });

        // ESC key closes modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && downloadModal.classList.contains('active')) {
                closeModal();
            }
        });

        // Clear error styling on input
        if (downloadForm) {
            downloadForm.querySelectorAll('input, select').forEach(el => {
                el.addEventListener('input', () => el.classList.remove('error'));
            });
        }

        // Form Submission
        if (downloadForm) {
            downloadForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const isFirstNameOk = validateInput('dl-first-name');
                const isLastNameOk  = validateInput('dl-last-name');
                const isEmailOk     = validateEmailInput('dl-email');
                const isPhoneOk     = validateInput('dl-phone');
                const isCompanyOk   = validateInput('dl-company');

                if (!isFirstNameOk || !isLastNameOk || !isEmailOk || !isPhoneOk || !isCompanyOk) {
                    return;
                }

                const submitBtn = document.getElementById('btn-download-submit');
                const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span>Procesando...</span>';
                }

                // Collect form data
                const firstName = document.getElementById('dl-first-name').value.trim();
                const lastName  = document.getElementById('dl-last-name').value.trim();
                const email     = document.getElementById('dl-email').value.trim();
                const phoneCode = document.getElementById('dl-phone-code') ? document.getElementById('dl-phone-code').value : '';
                const phone     = document.getElementById('dl-phone').value.trim();
                const company   = document.getElementById('dl-company').value.trim();
                const docTitle  = docTitleInput ? docTitleInput.value : '';
                const pdfUrl    = pdfUrlInput ? pdfUrlInput.value : '';

                const fecha = new Date().toLocaleString('es-CO', {
                    timeZone: 'America/Bogota',
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });

                const emailBody = `
<!DOCTYPE html>
<html lang="es">
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
    .footer { background: #f4f4f4; padding: 16px 32px; text-align: center; font-size: 12px; color: #aaaaaa; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>EX-VIZ</h1>
      <p>Nuevo Lead de Descarga de Documento PDF</p>
      <span class="badge">Lead Descargas</span>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Nombre Completo</div>
        <div class="value">${firstName} ${lastName}</div>
      </div>
      <div class="field">
        <div class="label">Correo Electrónico</div>
        <div class="value">${email}</div>
      </div>
      <div class="field">
        <div class="label">Teléfono</div>
        <div class="value">${phoneCode} ${phone}</div>
      </div>
      <div class="field">
        <div class="label">Empresa</div>
        <div class="value">${company}</div>
      </div>
      <div class="field">
        <div class="label">Documento Solicitado</div>
        <div class="value">${docTitle}</div>
      </div>
      <div class="field">
        <div class="label">Ruta PDF</div>
        <div class="value">${pdfUrl}</div>
      </div>
      <div class="field" style="border-bottom:none;">
        <div class="label">Fecha y Hora</div>
        <div class="value">${fecha}</div>
      </div>
    </div>
    <div class="footer">
      <strong>EX-VIZ | Una empresa de EBEDIX | Todos los derechos reservados</strong>
    </div>
  </div>
</body>
</html>`;

                // Send via EmailJS
                if (typeof emailjs !== 'undefined' && emailjs.send) {
                    try {
                        await emailjs.send(
                            EMAILJS_CONFIG.serviceId,
                            EMAILJS_CONFIG.templateId,
                            {
                                subject: `[EX-VIZ Lead Descargas] - ${docTitle}`,
                                from_name: `${firstName} ${lastName}`,
                                from_email: email,
                                email_body: emailBody
                            },
                            EMAILJS_CONFIG.publicKey
                        );
                        console.info('✅ EmailJS lead notification sent successfully.');
                    } catch (err) {
                        console.warn('⚠️ EmailJS notification notice:', err);
                    }
                } else {
                    console.info('EmailJS data payload ready:', { firstName, lastName, email, docTitle, pdfUrl });
                }

                // Show Success Message
                downloadForm.style.display = 'none';
                if (downloadSuccessMsg) {
                    downloadSuccessMsg.style.display = 'block';
                }

                // Automatically trigger PDF download
                if (pdfUrl) {
                    const a = document.createElement('a');
                    a.href = pdfUrl;
                    a.download = pdfUrl.split('/').pop();
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }

                // Reset submit button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }

                // Close modal after delay
                setTimeout(() => {
                    closeModal();
                }, 3000);
            });
        }
    });
})();
