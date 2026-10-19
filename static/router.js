export class Router {
    constructor(opts = {}) {
        this.routes = new Map();
        this.currentRoute = null;
        this.container = opts.container || document.getElementById('mainContent');
        this.defaultRoute = opts.defaultRoute || 'home';
        this.onNavigate = opts.onNavigate || (() => {});
        this.isNavigating = false;

        window.addEventListener('popstate', (e) => {
            const route = e.state?.route || this.readHash();
            this.navigate(route, { push: false });
        });

        window.addEventListener('hashchange', () => {
            const route = this.readHash();
            if (route !== this.currentRoute) this.navigate(route, { push: false });
        });
    }

    register(name, renderFn) {
        this.routes.set(name, renderFn);
        return this;
    }

    readHash() {
        return window.location.hash.replace(/^#\/?/, '') || this.defaultRoute;
    }

    async navigate(route, opts = {}) {
        const { push = true } = opts;
        if (!this.routes.has(route)) {
            console.warn(`Route "${route}" not found, fallback to default`);
            route = this.defaultRoute;
        }
        if (!this.container) {
            console.error('Router: container missing');
            return;
        }
        if (this.isNavigating) return;
        this.isNavigating = true;

        try {
            this.container.innerHTML = '';
            const wrapper = document.createElement('div');
            wrapper.className = 'page';
            wrapper.id = `page-${route}`;

            const result = await this.routes.get(route)();
            if (typeof result === 'string') {
                wrapper.innerHTML = result;
            } else if (result instanceof HTMLElement) {
                wrapper.appendChild(result);
            }

            this.container.appendChild(wrapper);
            this.container.scrollTop = 0;

            this.currentRoute = route;
            if (push) history.pushState({ route }, '', `#/${route}`);
            this.updateActiveStates(route);
            this.onNavigate(route);
            try { localStorage.setItem('lastPage', route); } catch (e) {}
        } catch (err) {
            console.error('Router navigate error:', err);
            this.container.innerHTML = `
                <div class="page">
                    <div class="content-card" style="text-align:center">
                        <i class="fas fa-exclamation-triangle" style="font-size:2.5rem;color:var(--error);margin-bottom:12px"></i>
                        <h3>حدث خطأ في تحميل الصفحة</h3>
                        <p style="color:var(--text-secondary);margin-top:8px">${err.message || ''}</p>
                        <button class="btn-primary" style="margin-top:16px" onclick="location.reload()">
                            <i class="fas fa-redo"></i> إعادة المحاولة
                        </button>
                    </div>
                </div>
            `;
        } finally {
            this.isNavigating = false;
        }
    }

    updateActiveStates(route) {
        document.querySelectorAll('.bnav-item, .nav-item').forEach(el => {
            el.classList.toggle('active', el.dataset.page === route);
        });
    }

    init() {
        const route = this.readHash() || this.defaultRoute;
        this.navigate(route, { push: false });
    }
}