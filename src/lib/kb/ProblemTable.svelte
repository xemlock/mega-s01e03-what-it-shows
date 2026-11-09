<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { problemOf, uniqueById, type Problem, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket, issues }: { ticket: number; issues: Partial<Record<Problem, string>> } = $props();

  const rows = $derived(uniqueById(reports as Report[]).length);
  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(
    Object.entries(Object.groupBy(merged, (r) => problemOf(r, tenantOf(r), notes.oneDayMove)))
      .map(([problem, rs]) => {
        const days = rs!.map((r) => r.receivedAt.slice(0, 10)).sort();
        return { problem: problem as Problem, count: rs!.length, tenants: new Set(rs!.map((r) => r.tenant)).size, first: days[0], last: days.at(-1) };
      })
      .sort((a, b) => b.count - a.count),
  );
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ({(reports as Report[]).length} rows in the export, {(reports as Report[]).length - rows} of them repeats) ·
  <strong>{groups.length}</strong> problems
</p>

<table>
  <thead><tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th></tr></thead>
  <tbody>
    {#each groups as g (g.problem)}
      <tr>
        <td><code>{g.problem}</code></td>
        <td>{g.count}</td>
        <td>{g.tenants}</td>
        <td>{g.first} → {g.last}</td>
        <td>{#if issues[g.problem]}<a href={issues[g.problem]}>{issues[g.problem]?.replace(/^.*\/issues\//, '#')}</a>{:else}none yet{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
</style>
