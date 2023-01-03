<script lang="ts">
	export let handleClick: Function;
</script>

<button
	on:click={() => handleClick()}
	class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
	tabindex="-1"
>
	<slot />
</button>
