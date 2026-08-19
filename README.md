# Theme Portal Backend

Backend API for the Theme Portal application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/theme-portal
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CORS_ORIGIN=http://localhost:5173
```

3. Start MongoDB locally or use MongoDB Atlas

4. Run the server:
```bash
npm run dev
```

## API Endpoints

### Partners
- `GET /api/partners` - Get all partners
- `GET /api/partners/:id` - Get partner by ID
- `POST /api/partners` - Create partner (with file upload)
- `PUT /api/partners/:id` - Update partner
- `DELETE /api/partners/:id` - Delete partner

### Themes (Protected)
- `GET /api/themes` - Get all themes (with optional partnerId query)
- `GET /api/themes/:id` - Get theme by ID
- `GET /api/themes/partner/:partnerId` - Get themes by partner
- `GET /api/themes/:id/export` - Export theme as JSON
- `POST /api/themes` - Create theme
- `POST /api/themes/import` - Import theme from JSON
- `PUT /api/themes/:id` - Update theme
- `DELETE /api/themes/:id` - Delete theme

### Public Endpoints (No Auth Required)
- `GET /api/public/themes/:partnerId` - Get latest theme for a partner (for lola-framework-ui-test integration)

## Theme Formats

### Legacy Format
```json
{
  "font": { ... },
  "colors": { ... }
}
```

### Actual Format (Recommended)
```json
{
  "font": { ... },
  "colors": { 
    ...
    "errorViewBackground": "#051510",
    "specialViewBackground": "...",
    "cardPanelBackground": "transparent",
    "cardBackground": "#eeeef1",
    "cardBackgroundSecundary": "#17171c"
  },
  "styles": {
    "cardBorderRadius": "16px",
    "buttonBorderRadius": "99999px",
    "inputBorderRadius": "8px",
    "cardBorderColor": "#E4E4E4",
    "inputBorderColor": "#E4E4E4",
    "activeBorderBoton": "#1DAFA1",
    "tamañoBordeCard": "1px",
    "tamañoBordeInput": "1px",
    "buttonPadding": "1rem",
    "inputPadding": "0.75rem",
    "cardPadding": "1.5rem",
    "buttonSize": "medium",
    "buttonShowIcon": false
  }
}
```

## Integration with lola-framework-ui-test

This portal is designed to serve themes for applications using the **lola-framework-ui-test** UI kit.

Applications can fetch themes without authentication:

```bash
curl https://your-api.com/api/public/themes/partner-001
```

See [INTEGRATION.md](../INTEGRATION.md) for complete integration guide.

## Tech Stack
- Node.js
- Express.js
- MongoDB with Mongoose
- Clerk for authentication
- Multer for file uploads
# partner-theme-portal-backend
