<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import TickerSearch from '$lib/components/TickerSearch.svelte';
	import SplitButtons from '$lib/components/SplitButtons.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import PanesTree from '$lib/components/PanesTree.svelte';
	import { fmpKey } from '$lib/store/fmp';
	import { panesTree } from '$lib/store/panes';
</script>

<div class="h-screen">
	<Navbar>
		<TextInput id="fmp-key" label="FMP API Key" type="password" bind:value={$fmpKey} />
		<TickerSearch />
		<SplitButtons />
	</Navbar>

	<Alert />
	<PanesTree tree={$panesTree} />
</div>
