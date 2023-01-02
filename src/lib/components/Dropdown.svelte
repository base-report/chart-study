<script lang="ts">
	import { scale } from 'svelte/transition';
	import { clickOutside } from 'svelte-use-click-outside';

	export let showDropDown = false;
</script>

<div class="absolute z-20 inline-block text-left">
	<button
		on:click={() => {
			if (!showDropDown) showDropDown = true;
		}}
		type="button"
		class="flex items-center rounded-full text-indigo-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-100"
		id="menu-button"
		aria-expanded="true"
		aria-haspopup="true"
	>
		<slot name="label" />
		<span class="sr-only">Open dropdown options</span>
	</button>

	{#if showDropDown}
		<div
			use:clickOutside={() => setTimeout(() => (showDropDown = false), 10)}
			in:scale={{ duration: 100, start: 0.95 }}
			out:scale={{ duration: 75, start: 0.95 }}
			class="w-32 absolute left-0 mt-3 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-300"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			<div class="py-1" role="none">
				<slot name="options" />
			</div>
		</div>
	{/if}
</div>
