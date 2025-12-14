
<script lang="ts">
  import { page } from '$app/state';

</script>

<div class="flex flex-col justify-center items-center w-screen h-screen p-8 text-gray-200">
  <h1 class="text-3xl font-bold mb-4">Error {page.status}</h1>
  <p class="text-lg">{page.error?.message}</p>
</div>