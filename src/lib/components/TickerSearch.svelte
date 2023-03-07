<script lang="ts">
	import type { MaybeNumber } from 'base-report-util';
	import type { SearchResult } from '$lib/data/decoders/SearchResult';

	import { scale } from 'svelte/transition';
	import { clickOutside } from '$lib/actions/clickOutside';
	import TextInput from '$lib/components/TextInput.svelte';
	import SearchIcon from '$lib/components/icons/Search.svelte';
	import { ticker } from '$lib/store/ticker';
	import { alert, resetAlert } from '$lib/store/alert';

	let keywords = '';
	let timer: ReturnType<typeof setTimeout>;
	let results: SearchResult[] = [];
	let highlightedIndex: MaybeNumber = null;
	let hide = false;

	$: keywords.length > -1 && handleInputChange();

	const handleInputChange = () => {
		if (hide) {
			return;
		}

		if (keywords.length === 0) {
			results = [];
			return;
		}

		clearTimeout(timer);
		timer = setTimeout(async () => {
			if (keywords.length > 0) {
				try {
					const url = `/api/ticker-search?keywords=${keywords}`;
					const response = await fetch(url);
					const data = await response.json();
					if (!response.ok && data.message) {
						throw new Error(data.message);
					} else {
						results = data;
						resetAlert();
					}
				} catch (e) {
					if (e instanceof Error) {
						results = [];
						$alert = { text: e.message, type: 'error' };
					}
				} finally {
					hide = false;
					highlightedIndex = null;
				}
			}
		}, 300);
	};

	const selectTickerByIndex = (index: number) => {
		$ticker = results[index].symbol;
		hide = true;
		keywords = $ticker;
	};

	const handleKeydown = (event: KeyboardEvent) => {
		const { key } = event;

		if (key === 'Escape') {
			keywords = '';
			resetAlert();
		} else {
			hide = false;

			if (key === 'ArrowUp') {
				// up
				highlightedIndex = highlightedIndex ? highlightedIndex - 1 : results.length - 1;
			} else if (key === 'ArrowDown') {
				highlightedIndex =
					highlightedIndex === null || highlightedIndex === results.length - 1
						? 0
						: highlightedIndex + 1;
			} else if (key === 'Enter' && highlightedIndex !== null) {
				selectTickerByIndex(highlightedIndex);
			}
		}
	};

	const handleClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement;

		if (target.tagName === 'INPUT') {
			hide = false;
		}
	};
</script>

<div class="relative z-30" on:keydown={handleKeydown}>
	<TextInput
		id="ticker-search"
		label="Search: e.g. Apple or AAPL"
		bind:value={keywords}
		icon={SearchIcon}
		isWide={true}
		{handleClick}
	/>

	{#if results.length > 0 && !hide}
		<div
			use:clickOutside={() => (hide = true)}
			in:scale={{ duration: 100, start: 0.95 }}
			out:scale={{ duration: 75, start: 0.95 }}
			class="absolute left-0 top-12 right-0 z-20 max-h-96 overflow-auto rounded-md bg-white shadow dark:bg-gray-600"
		>
			<ul class="divide-y divide-gray-200">
				{#each results as r, i}
					<li
						class={`${
							highlightedIndex === i && 'bg-indigo-50 dark:bg-gray-700'
						} flex py-4 hover:bg-indigo-50 dark:hover:bg-gray-700`}
						on:click={() => selectTickerByIndex(i)}
						on:keydown={() => {}}
					>
						<span class="w-full cursor-pointer">
							<div class="ml-3">
								<p class="text text-gray-900 dark:text-gray-100">
									<span class="font-medium">
										{r.symbol}
									</span>
									| {r.exchangeShortName}
								</p>
								<p class="text-xs text-gray-700 dark:text-gray-300">
									{r.name}
								</p>
							</div>
						</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
