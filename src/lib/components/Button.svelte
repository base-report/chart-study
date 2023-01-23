<script lang="ts">
	export let handleClick: () => void;
</script>

<button
	type="button"
	on:click={handleClick}
	class="inline-flex w-full justify-center whitespace-nowrap rounded-md border border-gray-300 bg-white px-2 py-0 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
>
	<slot />
</button>
