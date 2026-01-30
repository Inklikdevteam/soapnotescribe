# Signup Control Guide

## Disabling User Signups

You can disable new user registrations while keeping the login functionality active.

### How to Disable Signups

1. **Edit `.env.local`:**
   ```env
   DISABLE_SIGNUPS=true
   NEXT_PUBLIC_DISABLE_SIGNUPS=true
   ```

2. **Restart your Next.js server:**
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

### What Happens When Signups Are Disabled

- ✅ Login page remains accessible
- ✅ Existing users can still log in
- ❌ Signup page shows "Signups Disabled" message
- ❌ Signup buttons hidden on homepage
- ❌ Direct signup attempts are blocked

### Homepage Behavior

**When signups are enabled (default):**
- Shows "Sign Up" and "Log In" buttons
- Users can create new accounts

**When signups are disabled:**
- Only shows "Log In" button
- Signup page redirects to login with error message

### Re-enabling Signups

1. **Edit `.env.local`:**
   ```env
   DISABLE_SIGNUPS=false
   NEXT_PUBLIC_DISABLE_SIGNUPS=false
   ```

2. **Restart your Next.js server**

### Creating Users When Signups Are Disabled

If you need to create users while signups are disabled, you have two options:

#### Option 1: Temporarily Enable Signups
1. Set `DISABLE_SIGNUPS=false` in `.env.local`
2. Restart server
3. Create the user account
4. Re-disable signups
5. Restart server

#### Option 2: Create User via PocketBase Admin
1. Go to http://127.0.0.1:8090/_/
2. Click on "users" collection
3. Click "New record"
4. Fill in:
   - email
   - password
   - passwordConfirm (same as password)
   - emailVisibility: true
5. Click "Create"

### Environment Variables

| Variable | Purpose | Values |
|----------|---------|--------|
| `DISABLE_SIGNUPS` | Server-side signup control | `true` or `false` |
| `NEXT_PUBLIC_DISABLE_SIGNUPS` | Client-side UI control | `true` or `false` |

**Important:** Both variables must match for consistent behavior.

### Production Deployment

When deploying to production, set these environment variables in your hosting platform:

**Vercel:**
```bash
vercel env add DISABLE_SIGNUPS
vercel env add NEXT_PUBLIC_DISABLE_SIGNUPS
```

**Other platforms:**
Add the variables through your platform's environment variable settings.

---

## Current Status

Check your current signup status:

```bash
# View current settings
cat .env.local | grep DISABLE_SIGNUPS
```

Default: Signups are **enabled** (`false`)
