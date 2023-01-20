<script lang="ts">
	import { scale } from 'svelte/transition';
	import { clickOutside } from 'svelte-use-click-outside';
	import ChevronDownIcon from '$lib/components/icons/ChevronDown.svelte';

	export let showDropDown = false;
	export let hideOnSelect = true;

	const handleClick = () => {
		if (!hideOnSelect) return;
		showDropDown = false;
	};
</script>

<div class="relative z-20 inline-block text-left">
	<button
		type="button"
		on:click={() => (showDropDown = !showDropDown)}
		class="inline-flex w-full justify-center whitespace-nowrap rounded-md border border-gray-300 bg-white px-2 py-0 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
	>
		<slot name="label" />
		<span class="sr-only">Open dropdown options</span>
		<ChevronDownIcon />
	</button>

	{#if showDropDown}
		<div
			use:clickOutside={() => setTimeout(() => (showDropDown = false), 10)}
			on:click={handleClick}
			on:keyup={(e) => {
				if (e.key === 'Escape' || e.key === 'Enter') {
					showDropDown = false;
				}
			}}
			in:scale={{ duration: 100, start: 0.95 }}
			out:scale={{ duration: 75, start: 0.95 }}
			class="absolute left-0 mt-3 w-32 origin-top-right rounded-md bg-gray-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-600"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			<div class="divide-y divide-gray-300 py-1 dark:divide-gray-500" role="none">
				<slot name="options" />
			</div>
		</div>
	{/if}
</div>
