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

- Keep deployment-critical menu imagery bundled with the frontend so official-domain rendering never depends on the old site.
- Weekly menu validity lives in `tydenni_menu` (date-only OD/DO, `zverejneno`); items link via `menu_polozky.menu_id`, and "today" is computed in Europe/Prague via `src/lib/pragueDate.ts` — avoids timezone day shifts. Items with null `menu_id` are legacy and shown only when no menu is valid.
- Weekly day copy and menu duplication run as staff-checked RPCs (`copy_weekly_day`, `duplicate_weekly_menu`) that deactivate, never delete — keeps copies atomic and history intact.
- Tests run with `bun test ./tests/<file>.test.ts`.
