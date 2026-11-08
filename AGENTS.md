<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Wedding content (date, venue, gallery photos) lives in src/lib/wedding.ts; edit there so sections stay in sync.
- The first two accounts created get the 'couple' role (DB trigger) and can read RSVPs at /portal; roles live in user_roles.
- Keep the opening flow as envelope, dismissible timed wedding welcome, then invitation; dedicated presentation components isolate animation from RSVP and account logic.
