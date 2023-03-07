<script lang="ts">
	import type { EntryStrategy, ExitStrategy } from 'base-report-util';

	import { getCombos } from 'base-report-util';
	import { chartData } from '$lib/store/timeseries';
	import MoveFinderTable from './MoveFinderTable.svelte';

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
	<MoveFinderTable {combos} />
</div>
