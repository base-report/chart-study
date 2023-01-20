<script lang="ts">
	import type { EntryStrategy, ExitStrategy } from '$lib/data/types/Strategy';

	import { chartData, selectMove } from '$lib/store/timeseries';
	import { getCombos, round } from './util';

	// TODO: add sort by column
	export let entry: string;
	export let exit: string;
	export let gains: string;

	$: entryStrategy = (
		entry === 'EP' ? 'EP' : parseInt(entry.match(/(\d+)/)?.[0] || '10') || 10
	) as EntryStrategy;
	$: exitStrategy = parseInt(exit.match(/(\d+)/)?.[0] || '10') as ExitStrategy;
	$: minGain = parseInt(gains.match(/(\d+)/)?.[0] || '20') / 100;

	$: candles = $chartData.daily;

	$: combos = getCombos({ candles, entryStrategy, exitStrategy, minGain });
</script>

<div class="h-full overflow-y-auto">
	<table class="w-full table-auto text-gray-800 dark:text-gray-200">
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
</div>

<style lang="postcss">
	tr {
		@apply opacity-80 hover:opacity-100;
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
