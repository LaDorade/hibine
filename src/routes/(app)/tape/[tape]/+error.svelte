<script lang="ts">
    import { resolve } from '$app/paths';
</script>

<div class="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
    <h1 class="text-4xl font-bold mb-4">404 - Not Found</h1>
    <p class="text-lg">The tape you are looking for does not exist.</p>
    <a href={resolve('/')} class="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">Go to Home</a>
</div>