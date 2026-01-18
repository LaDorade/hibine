<script lang="ts">
  import { settings } from '$stores/Settings.svelte';
</script>

<section data-testid="settings" class="w-full overflow-auto h-full p-4 flex flex-col gap-2">
  <h3 class="text-xl">Editor Settings</h3>
  <div class=" pl-2 w-full grid grid-cols-2 gap-x-4 gap-y-2">
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
</section>
