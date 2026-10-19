export class DialogManager {
    constructor() {
        this.container = document.getElementById('dialogContainer');
    }

    show(options) {
        const {
            title = '',
            icon = 'fa-info-circle',
            content = '',
            input = null,
            confirmText = 'تأكيد',
            cancelText = 'إلغاء',
            onConfirm = null,
            danger = false,
        } = options || {};

        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'dialog-overlay';

            let inputHTML = '';
            if (input) {
                if (input.type === 'textarea') {
                    inputHTML = `<textarea class="dialog-input dialog-textarea" id="dialogInput" placeholder="${input.placeholder || ''}">${input.value || ''}</textarea>`;
                } else {
                    inputHTML = `<input type="${input.type || 'text'}" class="dialog-input" id="dialogInput" placeholder="${input.placeholder || ''}" value="${input.value || ''}">`;
                }
            }

            const confirmStyle = danger ? 'style="background:var(--error)"' : '';

            overlay.innerHTML = `
                <div class="dialog-panel">
                    <div class="dialog-head">
                        <h3><i class="fas ${icon}"></i> ${title}</h3>
                        <button class="dialog-close" aria-label="إغلاق">&times;</button>
                    </div>
                    <div class="dialog-body">
                        ${content}
                        ${inputHTML}
                    </div>
                    <div class="dialog-foot">
                        ${cancelText ? `<button class="btn-secondary" data-action="cancel">${cancelText}</button>` : ''}
                        <button class="btn-primary" data-action="confirm" ${confirmStyle}>${confirmText}</button>
                    </div>
                </div>
            `;

            this.container.appendChild(overlay);

            requestAnimationFrame(() => {
                overlay.classList.add('active');
                const inputEl = overlay.querySelector('#dialogInput');
                if (inputEl) {
                    setTimeout(() => inputEl.focus(), 150);
                    inputEl.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' && input.type !== 'textarea') {
                            e.preventDefault();
                            handleConfirm();
                        }
                    });
                }
            });

            const close = (result) => {
                overlay.classList.remove('active');
                setTimeout(() => {
                    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                }, 250);
                resolve(result);
            };

            const handleConfirm = () => {
                const inputEl = overlay.querySelector('#dialogInput');
                const value = inputEl ? inputEl.value.trim() : true;
                if (input && input.required && !value) {
                    if (inputEl) {
                        inputEl.style.borderColor = 'var(--error)';
                        inputEl.focus();
                    }
                    return;
                }
                if (onConfirm) onConfirm(value);
                close(value || true);
            };

            overlay.querySelector('.dialog-close').addEventListener('click', () => close(null));
            overlay.querySelector('[data-action="confirm"]').addEventListener('click', handleConfirm);
            const cancelBtn = overlay.querySelector('[data-action="cancel"]');
            if (cancelBtn) cancelBtn.addEventListener('click', () => close(null));

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) close(null);
            });

            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', escHandler);
                    close(null);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    }

    confirm(message, opts = {}) {
        return this.show({
            title: opts.title || 'تأكيد',
            icon: opts.icon || 'fa-question-circle',
            content: `<p>${message}</p>`,
            confirmText: opts.confirmText || 'نعم',
            cancelText: opts.cancelText || 'إلغاء',
            danger: opts.danger || false,
        });
    }

    alert(message, opts = {}) {
        return this.show({
            title: opts.title || 'تنبيه',
            icon: opts.icon || 'fa-info-circle',
            content: `<p>${message}</p>`,
            confirmText: opts.confirmText || 'حسناً',
            cancelText: '',
        });
    }

    prompt(message, opts = {}) {
        return this.show({
            title: opts.title || 'إدخال',
            icon: opts.icon || 'fa-pen',
            content: `<p>${message}</p>`,
            input: {
                type: opts.type || 'text',
                placeholder: opts.placeholder || '',
                value: opts.value || '',
                required: opts.required !== false,
            },
            confirmText: opts.confirmText || 'حفظ',
            cancelText: opts.cancelText || 'إلغاء',
        });
    }
}

export class ToastManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
    }

    show(message, type = 'info', duration = 3000) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
        };
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
        this.container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 250);
        }, duration);
        return toast;
    }

    success(msg) { return this.show(msg, 'success'); }
    error(msg) { return this.show(msg, 'error'); }
    warning(msg) { return this.show(msg, 'warning'); }
    info(msg) { return this.show(msg, 'info'); }
}

export const dialog = new DialogManager();
export const toast = new ToastManager();