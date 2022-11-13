<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import TickerSearch from '$lib/components/TickerSearch.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import Charts from '$lib/components/Charts.svelte';
	import { fmpKey } from '$lib/store/fmp';
</script>

<Navbar>
	<TextInput id="fmp-key" label="FMP API Key" type="password" bind:value={$fmpKey} />
	<TickerSearch />
</Navbar>

<Alert />
<Charts />
