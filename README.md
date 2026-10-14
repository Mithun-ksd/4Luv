# 4Luv ♥

**4Luv** is a free birthday wish website. Anyone can create a personalized birthday page for someone special, choose a cake, decorations and a theme, and share it with a private link. No account is needed.

## How it works

1. The sender fills in the create form: recipient name, message, sender name (optional), cake, decorations, theme and a custom URL name.
2. The wish is saved in a Supabase (PostgreSQL) database.
3. The sender gets a link like `https://your-site.vercel.app/wish.html?wish=john` to copy or share.
4. The receiver opens the link and sees the birthday page.

## Features

- Live preview while creating a wish
- 5 cakes, 5 decorations (pick any number) and 5 themes
- Custom link name (3-30 lowercase letters, numbers or hyphens)
- Copy and native share buttons (share sheet on phones)
- Replay animation on the wish page
- Friendly "wish not found" page
- No sign-up or login

## Tech stack

- HTML, CSS and vanilla JavaScript (no framework, no build step)
- [Supabase](https://supabase.com) for the database (PostgreSQL)
- [Vercel](https://vercel.com) for hosting

## Project structure

```
4Luv/
├── index.html       Home page
├── create.html      Create a wish
├── success.html     Share link page
├── wish.html        The birthday page the receiver sees
├── 404.html         Wish not found
├── vercel.json      Security headers for Vercel
├── css/             Stylesheets (one shared, one per page)
└── js/
    ├── supabase.js  Supabase URL and public key
    ├── create.js    Form, live preview, saving the wish
    ├── success.js   Copy, share and view buttons
    ├── wish.js      Loads and displays a wish
    └── app.js       Home page script
```

## Setup

### 1. Create the database

Create a free project at supabase.com, open **SQL Editor** and run:

```sql
create table wishes (
  slug text primary key check (slug ~ '^[a-z0-9-]{3,30}$'),
  receiver_name text not null check (char_length(receiver_name) between 1 and 50),
  message text not null check (char_length(message) between 1 and 500),
  sender_name text check (char_length(sender_name) <= 50),
  cake text not null default 'classic'
    check (cake in ('classic','cupcake','slice','pink','chocolate')),
  decorations text[] not null default '{}'
    check (decorations <@ array['hearts','balloons','confetti','sparkles','gifts']),
  theme text not null default 'sweet-pink'
    check (theme in ('sweet-pink','party-pop','dreamy','love','classic')),
  created_at timestamptz not null default now()
);

alter table wishes enable row level security;

create policy "anyone can create" on wishes
  for insert to anon with check (true);

create function get_wish(p_slug text)
returns setof wishes language sql security definer set search_path = public
as $$ select * from wishes where slug = p_slug $$;

grant insert on public.wishes to anon;
grant execute on function public.get_wish(text) to anon;
```

Visitors can only create a wish or open one by its exact link name. They cannot list or read other wishes.

### 2. Add your Supabase keys

In Supabase go to **Project Settings → API** and copy the **Project URL** and the **publishable (anon)** key. Paste them into `js/supabase.js`:

```js
const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_PUBLISHABLE_KEY";
```

The publishable key is designed to be public. **Never** put the `secret` or `service_role` key in this project.

If you change the Supabase URL, also update it in the `connect-src` part of `vercel.json`.

### 3. Run locally

Don't open the HTML files by double-clicking. Use a local server:

```
python -m http.server 8000
```

Then open `http://localhost:8000`. (VS Code's Live Server extension works too.)

### 4. Deploy

Push the project to GitHub, import it on Vercel, set the framework preset to **Other** and leave the build command and output directory empty. Keep `vercel.json` next to `index.html`.

## Security notes

- Row Level Security is on, and the database only allows inserting a wish or fetching one by its exact link name.
- Database `check` rules enforce length limits and allowed cake, decoration and theme values, even if someone bypasses the form.
- User text is displayed with `textContent`, never `innerHTML`, to prevent script injection.
- `vercel.json` adds a Content Security Policy and other security headers.
- Wish pages are marked `noindex` so they stay out of search engines.

## Known limitations

- The selected theme is saved but not yet applied to the wish page.
- No spam protection yet. Rate limiting or a CAPTCHA (for example through a Supabase Edge Function) could be added if abuse appears.
- Link names are chosen by the sender, so a short, common name can be guessed by others.

## License

Personal project. Add a license of your choice before sharing the code publicly.
