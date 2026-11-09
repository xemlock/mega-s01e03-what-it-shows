<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, readAs, uniqueById, type Cause, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  type Ticket = { url: string; outcome: string };
  let { ticket, tickets, oneDay }: { ticket: number; tickets: Partial<Record<Cause, Ticket>>; oneDay?: Ticket } = $props();

  const all = reports as Report[];
  const merged = $derived(uniqueById(all).filter((r) => r.mergedInto === ticket));
  // Counted the desk's way: by tenant and form, a report the desk read differently stays where it is filed.
  const groups = $derived(groupByCause(merged, tenantOf));
  const num = (url: string) => url.replace(/^.*\/issues\//, '#');
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ({all.length} rows in the export, {all.length - uniqueById(all).length} of them repeats) ·
  <strong>{groups.length}</strong> causes
</p>

<table>
  <thead><tr><th>cause</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th><th>outcome</th></tr></thead>
  <tbody>
    {#each groups as g (g.cause)}
      {@const t = g.cause === 'unplaced' ? undefined : tickets[g.cause]}
      <tr>
        <td><code>{g.cause}</code></td>
        <td>{g.reports.length}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if t}<a href={t.url}>{num(t.url)}</a>{:else}none{/if}</td>
        <td>{t?.outcome ?? ''}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#each groups as g (g.cause)}
  {@const moved = readAs(g, notes.oneDayMove)}
  {#if moved}
    <p class="note">
      {moved} of the <code>{g.cause}</code> reports read as a one-day move: counted under <code>{g.cause}</code>, filed
      {#if oneDay}as <a href={oneDay.url}>{num(oneDay.url)}</a> ({oneDay.outcome}){/if}.
    </p>
  {/if}
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
</style>
