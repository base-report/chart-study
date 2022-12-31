<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import TickerSearch from '$lib/components/TickerSearch.svelte';
	import SplitButtons from '$lib/components/SplitButtons.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import PanesTree from '$lib/components/PanesTree.svelte';
	import { panesTree } from '$lib/store/panes';
</script>

<div class="h-screen">
	<Navbar>
		<TickerSearch />
		<SplitButtons />
	</Navbar>

	<div class="h-[calc(100%-64px)]">
		<Alert />
		<PanesTree tree={$panesTree} />
	</div>
</div>
