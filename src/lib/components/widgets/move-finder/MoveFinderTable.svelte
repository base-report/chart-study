<script lang="ts">
	import type { ChartData } from 'base-report-util';

	import { round } from 'base-report-util';
	import { selectMove } from '$lib/store/timeseries';

	export let combos: ChartData[][];
</script>

<table class="w-full table-auto text-sm text-gray-800 dark:text-gray-100">
	<thead>
		<tr>
			<th>Entry</th>
			<th>Exit</th>
			<th>Diff</th>
			<th>Days</th>
			<th>Diff / Day</th>
		</tr>
	</thead>
	<tbody>
		{#each combos as c}
			{@const entry = c[0]}
			{@const exit = c[c.length - 1]}
			{@const entryDate = new Date(entry[5]).toLocaleDateString('en-CA')}
			{@const exitDate = new Date(exit[5]).toLocaleDateString('en-CA')}
			{@const diffPct = round(((exit[3] - entry[3]) / entry[3]) * 100, 2)}
			{@const days = c.length}
			{@const diffPerDay = round(diffPct === 'N/A' ? 'N/A' : diffPct / days, 2)}

			<tr on:click={() => selectMove({ entry, exit })} title="click to jump to move">
				<td>{entryDate}</td>
				<td>{exitDate}</td>
				<td>{diffPct}%</td>
				<td>{days}</td>
				<td>{diffPerDay}%</td>
			</tr>
		{/each}
	</tbody>
</table>

<style lang="postcss">
	tr {
		@apply text-left opacity-80 hover:opacity-100;
	}

	th,
	td {
		@apply border-collapse border border-slate-300 px-1 dark:border-slate-700;
	}
	th {
		@apply sticky top-0 bg-white dark:bg-black;
	}
	td {
		@apply cursor-pointer;
	}
</style>
