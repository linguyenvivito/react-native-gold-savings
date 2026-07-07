# GoldSavings Mobile (Expo)

## Local environment setup

1. Copy the template and fill values.

```bash
cp .env.example .env
```

2. Required variables in `.env`:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_KEY` (anon/publishable key only)
- `EXPO_PUBLIC_API_BASE_URL`

3. Optional backward compatibility variable:

- `EXPO_PUBLIC_BACKEND_URL` (keep equal to `EXPO_PUBLIC_API_BASE_URL`)

4. Start app:

```bash
npm install
npx expo start
```

### Local URL tips

- Real device on same Wi-Fi: use your computer LAN IP, for example `http://192.168.1.10:8000`
- Android emulator: `http://10.0.2.2:8000`
- iOS simulator: `http://127.0.0.1:8000`

## Deploy environment setup (EAS)

Set public runtime variables in Expo/EAS so cloud builds receive the right values.

### Option A: Expo dashboard

Set project variables for each environment (`preview`, `production`):

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_KEY`
- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_BACKEND_URL` (optional compatibility)

### Option B: EAS CLI

Run from this `Mobile` folder:

```bash
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project-id.supabase.co" --environment preview
eas env:create --name EXPO_PUBLIC_SUPABASE_KEY --value "your-anon-or-publishable-key" --environment preview
eas env:create --name EXPO_PUBLIC_API_BASE_URL --value "https://your-preview-api.example.com" --environment preview

eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project-id.supabase.co" --environment production
eas env:create --name EXPO_PUBLIC_SUPABASE_KEY --value "your-anon-or-publishable-key" --environment production
eas env:create --name EXPO_PUBLIC_API_BASE_URL --value "https://your-prod-api.example.com" --environment production
```

Then build:

```bash
eas build --profile preview --platform android
eas build --profile production --platform android
```

## Security notes

- Treat all `EXPO_PUBLIC_*` values as public.
- Never put private secrets in app env files or public env variables.
- Do not store service-role keys, DB passwords, or private API tokens in `EXPO_PUBLIC_*`.
