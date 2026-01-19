<script lang="ts">
  import { settings } from '$stores/Settings.svelte';
</script>

<section data-testid="settings" class={[
  'w-full overflow-auto h-svh p-4 flex flex-col gap-2 ',
  'max-w-4xl justify-self-center'
]}>
  <h2 class="text-3xl pb-4 border-b border-gray-500">
    Settings
  </h2>
  <h3 class="text-2xl pb-2">
    Editor Settings
  </h3>
  <div class=" pl-2 pb-2 w-full grid grid-cols-2 gap-x-4 gap-y-2 border-b">
    <label for="line-wrap" class="flex items-center gap-2 cursor-pointer">
      Line wrapping
    </label>
    <input
      type="checkbox"
      name="line-wrap"
      id="line-wrap"
      class={[
        'bg-gray-800 border border-black',
        'shadow-[2px_2px] shadow-black hover:shadow-[1px_1px] transition-all',
        'cursor-pointer',
        'appearance-none w-6 h-6',
        'checked:bg-green-400/50'
      ]}
      bind:checked={
				() => settings.get('lineWrap'),
				(newVal: boolean) => {
				  settings.set('lineWrap', newVal);
				}
      }
    />
    <label for="line-num" class="flex items-center gap-2 cursor-pointer">
      Show line numbers
    </label>
    <input
      type="checkbox"
      name="line-num"
      id="line-num"
      class={[
        'bg-gray-800 border border-black',
        'shadow-[2px_2px] shadow-black hover:shadow-[1px_1px] transition-all',
        'cursor-pointer',
        'appearance-none w-6 h-6',
        'checked:bg-green-400/50'
      ]}
      bind:checked={
				() => settings.get('lineNumbers'),
				(newVal: boolean) => {
				  settings.set('lineNumbers', newVal);
				}
      }
    />
  </div>
  <h3 class="text-2xl pb-2">View Settings</h3>
  <div class=" pb-2 pl-2 w-full grid grid-cols-2 gap-x-4 gap-y-2 border-b">
    <label for="show-bread" class="flex items-center gap-2 cursor-pointer">
      Show Breadcrumb
    </label>
    <input
      type="checkbox"
      name="show-bread"
      id="show-bread"
      class={[
        'bg-gray-800 border border-black',
        'shadow-[2px_2px] shadow-black hover:shadow-[1px_1px] transition-all',
        'cursor-pointer',
        'appearance-none w-6 h-6',
        'checked:bg-green-400/50'
      ]}
      bind:checked={
				() => settings.get('showBreadcrumb'),
				(newVal: boolean) => {
				  settings.set('showBreadcrumb', newVal);
				}
      }
    />
    
  </div>
</section>
