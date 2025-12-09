# Environment Variables

This document describes the environment variables used in the vayada frontend application.

## Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` with your configuration.

## Environment Variables

### `NEXT_PUBLIC_API_URL`

**Required**: Yes  
**Description**: The base URL for the backend API  
**Default**: `http://localhost:8000`  
**Example Values**:
- Local development: `http://localhost:8000`
- Production: `https://api.vayada.com`
- Staging: `https://api-staging.vayada.com`

**Note**: The `NEXT_PUBLIC_` prefix is required for Next.js to expose this variable to the browser.

### `NODE_ENV`

**Required**: No (automatically set by Next.js)  
**Description**: The Node.js environment  
**Default**: `development`  
**Values**: `development` | `production` | `test`

## File Structure

- `.env.example` - Template file with all required variables (committed to git)
- `.env.local` - Local development variables (gitignored)
- `.env` - Production/staging variables (gitignored, set in deployment platform)

## Deployment

### Vercel

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `NEXT_PUBLIC_API_URL` with your production backend URL

### Docker

Set environment variables in your `docker-compose.yml` or pass them when running:

```bash
docker run -e NEXT_PUBLIC_API_URL=https://api.vayada.com your-image
```

### Other Platforms

Set the environment variables in your deployment platform's configuration:
- Heroku: Use `heroku config:set`
- AWS: Use environment variables in your container/task definition
- DigitalOcean: Set in App Platform settings

## Important Notes

1. **Never commit `.env.local` or `.env` files** - they contain sensitive configuration
2. **Always use `NEXT_PUBLIC_` prefix** for variables that need to be accessible in the browser
3. **Restart the dev server** after changing environment variables
4. **Rebuild the application** for production after changing environment variables

