# Knowledge AI 



## Developing

Once you've clone this project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), 

Create `.env` file and put your supabase credentials:

```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
```

> `SUPABASE_SERVICE_KEY` is required only for server side code


start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
