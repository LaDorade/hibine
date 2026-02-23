<script lang="ts">
  import { resolve } from '$app/paths';
  import { coreAPI } from '$core/CoreAPI.svelte';
  import { page } from '$app/state';
  import { CassetteTape } from '@lucide/svelte';
  import * as Tooltip from '$lib/components/ui/tooltip';

  type Props = {
    class?: string;
  }
  let {
    class: className = ''
  }: Props = $props();

  let { tape } = $derived(page.params);
</script>

<Tooltip.TooltipProvider delayDuration={200}>
  <Tooltip.Root>
    <Tooltip.Trigger class="w-full" role="none" tabindex={-1}>
      <a class={[
        'w-full',
        'flex items-center gap-3 px-3 h-12 text-gray-200 bg-gray-800 hover:bg-gray-700', 
        'border-b-4 border-black',
        'transition-all duration-150',
        'border-l',
        coreAPI.clientSocket?.connected ? 'border-l-green-500' : 'border-l-red-500',
        className
      ]}
        href={resolve('/')}
      >
        <h2 class="">
          <CassetteTape strokeWidth={1.2} class="w-6" />
        </h2>
        <h3 class="text-lg">
          {tape}
        </h3>
      </a>
    </Tooltip.Trigger>
    <Tooltip.Content
      class={['text-gray-100 border shadow-xl bg-gray-800 backdrop-blur-[2px]']}
      arrow={true}
    >
      <div class="my-2 mx-1">
        Retourner à la Home
      </div>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.TooltipProvider>

