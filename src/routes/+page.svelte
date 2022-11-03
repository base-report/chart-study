<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	let fmpKey = '';
</script>

<Navbar>
	<TextInput id="fmp-key" label="FMP API Key" type="password" bind:value={fmpKey} />
</Navbar>
