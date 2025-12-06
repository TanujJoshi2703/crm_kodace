/**
 * Mock API Layer for Kodace CRM
 * Simulates network requests and persists data to localStorage.
 */

const MockApi = {
    useLocalStorageOnly: false, // Set to true to skip initial fetch (useful after first load)
    latencyMin: 100,
    latencyMax: 700,
    baseUrl: 'mock/', // Base URL for initial JSON seed data

    // Initialize the Mock API
    async init() {
        if (!localStorage.getItem('mockData')) {
            console.log('Initializing Mock API with seed data...');
            const resources = ['dashboard', 'deals', 'companies', 'contacts', 'projects', 'tickets'];
            const mockData = {};

            for (const resource of resources) {
                try {
                    const response = await fetch(`${this.baseUrl}${resource}.json`);
                    mockData[resource] = await response.json();
                } catch (error) {
                    console.error(`Failed to load seed data for ${resource}:`, error);
                    mockData[resource] = []; // Fallback
                }
            }
            localStorage.setItem('mockData', JSON.stringify(mockData));
        } else {
            console.log('Mock API loaded from localStorage.');
        }
    },

    // Simulate network delay
    _delay() {
        const ms = Math.floor(Math.random() * (this.latencyMax - this.latencyMin + 1) + this.latencyMin);
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Get all items for a resource
    async get(resource) {
        await this._delay();
        const data = JSON.parse(localStorage.getItem('mockData') || '{}');
        return data[resource] || [];
    },

    // Get a single item by ID
    async getById(resource, id) {
        await this._delay();
        const data = JSON.parse(localStorage.getItem('mockData') || '{}');
        const items = data[resource] || [];
        // Handle both array of objects and specific structures like deals.json which has { stages: [], deals: [] }
        if (resource === 'deals' && !Array.isArray(items)) {
             return items.deals.find(item => item.id === id);
        }
        return items.find(item => item.id === id);
    },

    // Create a new item
    async create(resource, payload) {
        await this._delay();
        const data = JSON.parse(localStorage.getItem('mockData') || '{}');
        
        // Generate a simple ID
        const newId = `${resource.charAt(0)}${Date.now()}`;
        const newItem = { id: newId, ...payload };

        if (resource === 'deals' && !Array.isArray(data[resource])) {
            data[resource].deals.push(newItem);
        } else {
            if (!data[resource]) data[resource] = [];
            data[resource].push(newItem);
        }

        localStorage.setItem('mockData', JSON.stringify(data));
        return newItem;
    },

    // Update an item (PUT)
    async update(resource, id, payload) {
        await this._delay();
        const data = JSON.parse(localStorage.getItem('mockData') || '{}');
        
        let items = data[resource];
        let isNested = false;

        if (resource === 'deals' && !Array.isArray(items)) {
            items = items.deals;
            isNested = true;
        }

        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...payload };
            if (isNested) {
                data[resource].deals = items;
            } else {
                data[resource] = items;
            }
            localStorage.setItem('mockData', JSON.stringify(data));
            return items[index];
        }
        throw new Error('Item not found');
    },

    // Patch an item (Partial Update)
    async patch(resource, id, patch) {
        await this._delay();
        const data = JSON.parse(localStorage.getItem('mockData') || '{}');
        
        let items = data[resource];
        let isNested = false;

        if (resource === 'deals' && !Array.isArray(items)) {
            items = items.deals;
            isNested = true;
        }

        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...patch };
             if (isNested) {
                data[resource].deals = items;
            } else {
                data[resource] = items;
            }
            localStorage.setItem('mockData', JSON.stringify(data));
            return items[index];
        }
        throw new Error('Item not found');
    },

    // Delete an item
    async delete(resource, id) {
        await this._delay();
        const data = JSON.parse(localStorage.getItem('mockData') || '{}');
        
        let items = data[resource];
        let isNested = false;

        if (resource === 'deals' && !Array.isArray(items)) {
            items = items.deals;
            isNested = true;
        }

        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items.splice(index, 1);
            if (isNested) {
                data[resource].deals = items;
            } else {
                data[resource] = items;
            }
            localStorage.setItem('mockData', JSON.stringify(data));
            return { success: true };
        }
        throw new Error('Item not found');
    },
    
    // Reset data to seed
    resetData() {
        localStorage.removeItem('mockData');
        location.reload();
    }
};

// TODO: To switch to a real API:
// 1. Set MockApi.useRealApi = true (or implement a flag)
// 2. Replace the methods above to use fetch(`${this.baseUrl}/${resource}`, ...)
// 3. Ensure the backend returns JSON in the expected format.
