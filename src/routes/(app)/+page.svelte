<script lang="ts">
  import { logout } from '$lib/remotes/users.remote';
  import { CassetteTape } from '@lucide/svelte';
  import TapeList from './TapeList.svelte';

  let { data } = $props();

  let creatingTape = $state(false);
</script>

<main class="flex flex-col h-svh md:max-w-5xl mx-auto">
  <nav
    class={[
      'flex justify-between md:w-full md:max-w-xl mx-4 md:mx-auto ',
      'gap-4 border-4 border-black border-t-0 p-2 px-8 mt-0 m-4',
      'shadow-[4px_4px] shadow-black bg-gray-800',
    ]}
  >
    <h1 data-testid="HomeHeading" class="text-3xl w-full text-center">
      {#if creatingTape}
        Creating Tape...
      {:else}
        Your Tapes
      {/if}
    </h1>
  </nav>
  <div class="mt-8 flex flex-col h-full w-full px-4 overflow-auto">
    <TapeList bind:creatingTape />
  </div>
  <footer
    class={[
      'flex justify-between items-center h-fit p-2 px-4 mx-4',
      'bg-gray-800',
      'border-4 border-black border-b-0',
      'shadow-[4px_4px] shadow-black',
      'font-light text-sm'
    ]}
  >
    <div class="flex items-center gap-4">
      <CassetteTape strokeWidth={1} class="w-8 h-8" />
      <span class="text-xl">Hibine.</span>
    </div>
    <div class="flex gap-4">
      {#if data.user?.id}
        <span class=" text-gray-200">{data.user.username}</span>
        <form {...logout}>
          <button class="cursor-pointer" {...logout.buttonProps}>
            Sign Out
          </button>
        </form>
      {/if}
    </div>
  </footer>
</main>

<style>
	:global(body) {
		background-size: 70px 70px;
		background-image:
			linear-gradient(to right, #ffffff10 1px, transparent 1px),
			linear-gradient(to bottom, #ffffff10 1px, transparent 1px);
	}
</style>