<script lang="ts">
  import type { TabViewEntry } from '$types/tabs';


  interface Props {
    entry: TabViewEntry
  }
  let {
    entry
  }: Props = $props();

  let Comp = $derived(entry.component);
</script>

<div class="h-full overflow-hidden">
  <Comp />
</div>