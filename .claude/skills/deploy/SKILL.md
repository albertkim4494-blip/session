---
name: deploy
description: Deploy a Supabase edge function to production
disable-model-invocation: true
---

# Deploy Supabase Edge Function

Deploy the edge function: **$ARGUMENTS**

## Steps

1. Verify the function exists:
   ```
   ls supabase/functions/$0/index.ts
   ```

2. Check for obvious issues — read the function file and look for:
   - Hardcoded secrets (should use `Deno.env.get()`)
   - Missing CORS headers
   - Uncaught errors without proper JSON error responses

3. Deploy with the **required** `--no-verify-jwt` flag:
   ```
   npx supabase functions deploy $0 --no-verify-jwt
   ```
   Without `--no-verify-jwt`, the Supabase gateway requires a valid user JWT and all requests return 401.

4. Report the deployment result.

## Available Functions

Check `supabase/functions/` for the current list. Known functions:
- `ai-coach` — GPT-4o-mini for coach insights and today's workout
- `ai-exercise-animation` — GPT-4o-mini for 3D animation keyframe generation

## Troubleshooting

- **401 errors**: You forgot `--no-verify-jwt`
- **Function not found**: Check the directory name matches exactly
- **CORS errors**: Ensure the function handles OPTIONS preflight requests
