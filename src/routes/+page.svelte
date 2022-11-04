<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import TickerSearch from '$lib/components/TickerSearch.svelte';
	import { fmpKey } from '$lib/store/fmp';
</script>

<Navbar>
	<TextInput id="fmp-key" label="FMP API Key" type="password" bind:value={$fmpKey} />
	<TickerSearch />
</Navbar>
