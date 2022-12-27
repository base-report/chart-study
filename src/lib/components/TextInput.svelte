<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let id: string;
	export let label: string;
	export let type: 'text' | 'password' = 'text';
	export let value: string;
	export let icon: SvelteComponent | null = null;
	export let isWide = false;
	export let handleClick: (event: MouseEvent) => void = () => {};
	export let handleKeyDown: (event: KeyboardEvent) => void = () => {};

	const handleInput = (e: Event) => {
		const eventValue = (e.target as HTMLInputElement).value;
		value = eventValue;
	};
</script>

<div class="relative" on:click={handleClick} on:keydown={handleKeyDown}>
	<label for={id} class="sr-only">{label}</label>
	<div class="relative rounded-md shadow-sm">
		<div class="relative text-gray-400 focus-within:text-gray-600 dark:focus-within:text-gray-200">
			{#if icon}
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<svelte:component this={icon} />
				</div>
			{/if}
			<input
				class={`${icon ? 'pl-10' : 'pl-2'} ${
					isWide ? 'w-72' : 'w-52'
				} block min-w-full rounded-md border border-transparent bg-white p-2 leading-5 text-gray-900 placeholder-gray-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 sm:text-sm`}
				placeholder={label}
				{id}
				name={id}
				{type}
				{value}
				on:input={handleInput}
			/>
		</div>
	</div>
</div>
