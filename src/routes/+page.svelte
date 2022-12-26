<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import TickerSearch from '$lib/components/TickerSearch.svelte';
	import SplitButtons from '$lib/components/SplitButtons.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import Frame from '$lib/components/Frame.svelte';
	import { fmpKey } from '$lib/store/fmp';
</script>

<div class="h-screen">
	<Navbar>
		<TextInput id="fmp-key" label="FMP API Key" type="password" bind:value={$fmpKey} />
		<TickerSearch />
		<SplitButtons />
	</Navbar>

	<Alert />
	<Frame />
</div>
