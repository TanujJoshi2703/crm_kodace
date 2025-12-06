# Kodace CRM - Frontend Skeleton

A complete frontend-only CRM skeleton for **Kodace Infotech** built with HTML, CSS (Tailwind), and JavaScript (Alpine.js). This application uses a client-side mock API backed by `localStorage` to simulate a real backend.

## 🚀 Features

- **Authentication**: Simple login page (accepts any credentials)
- **Dashboard**: Metrics overview with pipeline value, active projects, and open tickets
- **Deals Kanban**: Drag-and-drop deal pipeline with SortableJS
- **Companies & Contacts**: Searchable lists with CSV export
- **Projects**: Card-based view with progress tracking
- **Tickets**: Support ticket management
- **Settings**: Demo data reset and profile view
- **Mock API**: Client-side CRUD operations with localStorage persistence
- **Responsive Design**: Mobile-friendly layout with collapsible sidebar

## 📁 Project Structure

```
kodace-crm-frontend/
├── index.html              # Redirector (checks session)
├── login.html              # Login page
├── dashboard.html          # Dashboard overview
├── deals.html              # Kanban board
├── companies.html          # Companies list
├── contacts.html           # Contacts list
├── projects.html           # Projects grid
├── tickets.html            # Tickets table
├── settings.html           # Settings page
├── css/
│   └── styles.css          # Custom CSS
├── js/
│   ├── app.js              # Auth & global logic
│   ├── mock-api.js         # Mock API layer
│   ├── ui.js               # Alpine.js UI components
│   └── deals.js            # Kanban logic
└── mock/
    ├── dashboard.json      # Dashboard seed data
    ├── deals.json          # Deals & stages
    ├── companies.json      # Companies list
    ├── contacts.json       # Contacts list
    ├── projects.json       # Projects list
    └── tickets.json        # Tickets list
```

## 🛠️ How to Run

### Option 1: Open Directly in Browser
Simply open `index.html` in your browser. The app will work offline after the first load.

### Option 2: Use a Local Server (Recommended)

**Using Node.js:**
```bash
npx serve
```
Then open `http://localhost:3000`

**Using Python:**
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`

## 🔑 Login

Enter any email and password to log in. The app stores a fake session token in `localStorage`.

**Example:**
- Email: `admin@kodace.com`
- Password: `anything`

## 📦 CDN Dependencies

This project uses the following CDN libraries:

- **Tailwind CSS**: `https://cdn.tailwindcss.com`
- **Alpine.js**: `https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js`
- **SortableJS**: `https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js`

## 🔄 Mock API

The `MockApi` object in `js/mock-api.js` provides:

- `init()` - Load seed data from JSON files
- `get(resource)` - Get all items
- `getById(resource, id)` - Get single item
- `create(resource, payload)` - Create new item
- `update(resource, id, payload)` - Update item (PUT)
- `patch(resource, id, patch)` - Partial update (PATCH)
- `delete(resource, id)` - Delete item
- `resetData()` - Reset to seed data

All operations persist to `localStorage.mockData`.

## 🔌 Integrating with a Real Backend

To connect to a real API:

### 1. Update `js/mock-api.js`

Replace the mock methods with actual `fetch` calls:

```javascript
async get(resource) {
    const response = await fetch(`${this.baseUrl}/api/${resource}`);
    return await response.json();
}

async create(resource, payload) {
    const response = await fetch(`${this.baseUrl}/api/${resource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return await response.json();
}

// Similar for update, patch, delete...
```

### 2. Update `js/app.js` Login

Replace the mock login with a real API call:

```javascript
async login(email, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    this.user = data.user;
    localStorage.setItem('kodace_user', JSON.stringify(data.user));
    window.location.href = 'dashboard.html';
}
```

### 3. Expected API Endpoints

Your backend should provide:

- `POST /api/auth/login` - Login
- `GET /api/deals` - Get all deals
- `GET /api/deals/:id` - Get single deal
- `POST /api/deals` - Create deal
- `PATCH /api/deals/:id` - Update deal
- `DELETE /api/deals/:id` - Delete deal
- Similar endpoints for `companies`, `contacts`, `projects`, `tickets`

### 4. Expected JSON Format

**Deals:**
```json
{
  "stages": [
    { "id": "s1", "name": "Prospect" },
    { "id": "s2", "name": "Proposal" }
  ],
  "deals": [
    {
      "id": "d1",
      "title": "Acme Corp Renewal",
      "value": 50000,
      "company": "Acme Corp",
      "stageId": "s2",
      "owner": "Alice",
      "dueDate": "2025-12-15"
    }
  ]
}
```

**Companies, Contacts, Projects, Tickets:**
```json
[
  { "id": "c1", "name": "Acme Corp", "industry": "Manufacturing", "status": "Active" }
]
```

## 🎨 Removing Tailwind CDN (Optional)

To use Tailwind with a build step:

1. Install Tailwind:
```bash
npm install -D tailwindcss
npx tailwindcss init
```

2. Create `input.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. Build CSS:
```bash
npx tailwindcss -i ./input.css -o ./css/tailwind.css --watch
```

4. Replace CDN link in HTML files:
```html
<link rel="stylesheet" href="css/tailwind.css">
```

## 🚢 Deploying to Laravel

To integrate this frontend into a Laravel project:

1. **Copy files to `public/`:**
```bash
cp -r kodace-crm-frontend/* /path/to/laravel/public/crm/
```

2. **Create Blade layouts** (optional):
   - Extract sidebar/header into `resources/views/layouts/app.blade.php`
   - Use `@include` directives for partials

3. **Update routes** in `routes/web.php`:
```php
Route::get('/crm', function () {
    return view('crm.dashboard');
});
```

4. **Replace Mock API** with Laravel API routes:
   - Create controllers for Deals, Companies, etc.
   - Update `js/mock-api.js` to call `/api/deals`, etc.

## 🧪 Testing

1. Open `index.html` → should redirect to `login.html`
2. Login with any credentials → should redirect to `dashboard.html`
3. Check dashboard metrics are displayed
4. Go to **Deals** → drag a card between columns → refresh → position should persist
5. Go to **Companies** → search and export CSV
6. Go to **Settings** → click "Reset Demo Data" → data should reload

## 📝 Developer Notes

- **TODO markers**: Search for `// TODO` in `js/mock-api.js` and `js/app.js` for integration points
- **localStorage keys**: `kodace_user` (session), `mockData` (all data)
- **Accessibility**: Basic ARIA attributes included, keyboard navigation for SortableJS
- **Offline support**: Works offline after first load (data in localStorage)

## 📄 License

This is a demo skeleton for Kodace Infotech. Customize as needed.

---

**Built with ❤️ for Kodace Infotech**
