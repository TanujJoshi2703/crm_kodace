/**
 * UI Helpers and Alpine Components
 */

document.addEventListener('alpine:init', () => {
    // Layout Component
    Alpine.data('layout', () => ({
        sidebarOpen: true,
        toggleSidebar() {
            this.sidebarOpen = !this.sidebarOpen;
        },
        init() {
            // Responsive check
            if (window.innerWidth < 768) {
                this.sidebarOpen = false;
            }
        }
    }));

    // Quick Add Modal Component
    Alpine.data('quickAdd', () => ({
        isOpen: false,
        type: 'lead', // lead, task, ticket
        formData: {
            name: '',
            email: '',
            title: ''
        },
        open() { this.isOpen = true; },
        close() { this.isOpen = false; },
        async submit() {
            if (this.type === 'lead') {
                await MockApi.create('contacts', {
                    name: this.formData.name,
                    email: this.formData.email,
                    role: 'Lead',
                    companyId: null
                });
                showToast('Lead created successfully');
            }
            this.close();
            this.formData = { name: '', email: '', title: '' };
            // Trigger refresh if on relevant page
            window.dispatchEvent(new CustomEvent('data-updated'));
        }
    }));

    // Generic Data List Component
    Alpine.data('dataList', (resource) => ({
        items: [],
        loading: true,
        search: '',
        async init() {
            await this.loadData();
            window.addEventListener('data-updated', () => this.loadData());
        },
        async loadData() {
            this.loading = true;
            this.items = await MockApi.get(resource);
            this.loading = false;
        },
        get filteredItems() {
            if (!this.search) return this.items;
            const lower = this.search.toLowerCase();
            return this.items.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(lower)
                )
            );
        },
        exportCsv() {
            const headers = Object.keys(this.items[0] || {}).join(',');
            const rows = this.items.map(item => Object.values(item).join(','));
            const csv = [headers, ...rows].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${resource}_export.csv`;
            a.click();
        }
    }));
});
