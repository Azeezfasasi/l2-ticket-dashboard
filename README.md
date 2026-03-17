# l2-service-desk

This template should help get you started developing with Vue 3 in Vite.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# Google Sheets Integration Guide

## Option A: Sheety (⚡ Fastest - Recommended for Teams)

### Step 1: Prepare Your Google Sheet

1. Create a Google Sheet with these columns:
   - `ticketId` (TK-001)
   - `summary` (SQL Server Alert...)
   - `issueType` (Incident / Service Request)
   - `priority` (Critical / High / Medium / Low)
   - `status` (Open / In Progress / Resolved / Closed)
   - `assignee` (Taofiq / Oluwasegun / etc)
   - `reporter` (Name)
   - `daysOpen` (Number)
   - `createdDate` (YYYY-MM-DD)
   - `resolvedDate` (Optional)
   - `category` (Optional)

2. Share the sheet (make it accessible)

### Step 2: Set Up Sheety

1. Go to **https://sheety.co**
2. Click "New Project"
3. Paste your Google Sheet URL
4. Click "Authorize"
5. Select the sheet tab (e.g., "Tickets")
6. Click "Create"
7. You'll see your API endpoint

   ```

   ```

### Step 3: Update Your Store

Copy the endpoint URL from Sheety and update `src/stores/useTicketStore.ts`:

### Step 4: Enable Data Fetching

In `useTicketStore.ts`, uncomment these lines in the `fetchTickets()` function:

```typescript
const response = await axios.get(SHEETS_API);
tickets.value = response.data.rows;
```

✅ Done! Your dashboard will now pull live data from Google Sheets.

---

## Option B: Google Sheets API (More Control)

### Step 1: Create a Google Cloud Project

1. Go to **https://console.cloud.google.com**
2. Click "Create Project"
3. Name it "L2 Service Desk"
4. Click "Create"

### Step 2: Enable the Google Sheets API

1. In the left sidebar, click "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

### Step 3: Get Your API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the key (you'll use this in the dashboard)

### Step 4: Make Your Sheet Public

1. Open your Google Sheet
2. Click "Share" → Change to "Anyone with the link can view"
3. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

### Step 5: Update Your Store

In `src/stores/useTicketStore.ts`:

```typescript
const SHEET_ID = "YOUR_SHEET_ID_HERE";
const API_KEY = "YOUR_API_KEY_HERE";
const SHEETS_API = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Tickets?key=${API_KEY}`;
```

Then update the `fetchTickets()` function to parse the response:

```typescript
const fetchTickets = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(SHEETS_API);
    const rows = response.data.values;

    // Skip header row and map data
    tickets.value = rows.slice(1).map((row, idx) => ({
      id: `${idx}`,
      ticketId: row[0],
      summary: row[1],
      issueType: row[2],
      priority: row[3],
      status: row[4],
      assignee: row[5],
      reporter: row[6],
      daysOpen: parseInt(row[7]),
      createdDate: row[8],
      resolvedDate: row[9],
      category: row[10],
    }));
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to fetch tickets";
  } finally {
    isLoading.value = false;
  }
};
```

---

## Comparison

| Feature           | Sheety               | Google Sheets API   |
| ----------------- | -------------------- | ------------------- |
| Setup Time        | 2 minutes            | 10 minutes          |
| Auth Required     | No                   | API Key only        |
| Real-time Updates | Yes                  | Yes                 |
| Cost              | Free tier available  | Free tier available |
| Best For          | Teams, Non-technical | Complex queries     |
| Rate Limits       | 300 req/min          | 500 req/min         |

---

## Auto-Refresh Data

To refresh data periodically, add this to `useTicketStore.ts`:

```typescript
// Auto-fetch every 5 minutes
onMounted(() => {
  fetchTickets();
  setInterval(fetchTickets, 5 * 60 * 1000); // 5 minutes
});
```

Or add a manual refresh button to `DashboardView.vue`:

```vue
<button
  @click="store.fetchTickets()"
  class="px-4 py-2 bg-blue-600 text-white rounded"
>
  🔄 Refresh Now
</button>
```

---

## Testing

1. Add a test row to your Google Sheet
2. Wait 30 seconds (Sheety cache)
3. Refresh the dashboard
4. Verify the new ticket appears
