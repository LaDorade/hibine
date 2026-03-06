<script lang="ts">
  import '../app.css';
  import { Toaster, toast } from 'svelte-sonner';

  let {
    children,
  } = $props();
</script>

<svelte:window onerror={(e) => {
  console.error(e);
  toast.error('An error occurred, see console');
}} />

<Toaster
  toastOptions={{
    unstyled: true,
    classes: {
      toast: 'flex items-center gap-2 bg-gray-800 text-white border-2 border-black rounded-none shadow-[4px_4px] shadow-black px-4 py-2',
      title: 'font-bold mb-1',
      description: 'text-sm',
      info: 'border-blue-500',
      success: 'border-l-green-500',
      error: 'border-l-red-500',
    }
  }}
/>
{@render children?.()}