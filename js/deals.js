/**
 * Deals Kanban Logic
 */

document.addEventListener('alpine:init', () => {
    Alpine.data('kanban', () => ({
        stages: [],
        deals: [],
        loading: true,

        async init() {
            await this.loadData();
            this.$nextTick(() => {
                this.initSortable();
            });
        },

        async loadData() {
            this.loading = true;
            const data = await MockApi.get('deals');
            // Handle structure from deals.json
            if (data.stages && data.deals) {
                this.stages = data.stages;
                this.deals = data.deals;
            } else {
                // Fallback or different structure
                this.stages = [];
                this.deals = [];
            }
            this.loading = false;
        },

        getDealsByStage(stageId) {
            return this.deals.filter(d => d.stageId === stageId);
        },

        initSortable() {
            const columns = document.querySelectorAll('.kanban-column');
            columns.forEach(col => {
                new Sortable(col, {
                    group: 'kanban',
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    dragClass: 'sortable-drag',
                    onEnd: async (evt) => {
                        const itemEl = evt.item;
                        const newStageId = evt.to.dataset.stageId;
                        const dealId = itemEl.dataset.dealId;
                        const oldStageId = evt.from.dataset.stageId;

                        if (newStageId !== oldStageId) {
                            // Update local state first for responsiveness
                            const deal = this.deals.find(d => d.id === dealId);
                            if (deal) deal.stageId = newStageId;

                            // Call API
                            try {
                                await MockApi.patch('deals', dealId, { stageId: newStageId });
                                showToast('Deal updated');
                            } catch (e) {
                                showToast('Failed to update deal', 'error');
                                // Revert on error (reload)
                                this.loadData();
                            }
                        }
                    }
                });
            });
        },

        async convertToProject(dealId) {
            const deal = this.deals.find(d => d.id === dealId);
            if (!deal) return;

            if (confirm(`Convert "${deal.title}" to a project?`)) {
                await MockApi.create('projects', {
                    name: deal.title,
                    company: deal.company,
                    status: 'Planning',
                    progress: 0
                });
                showToast('Project created from deal');
            }
        }
    }));
});
