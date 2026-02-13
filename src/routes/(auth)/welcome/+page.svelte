<script lang="ts">
  import { createInitialUser } from '$lib/remotes/users.remote';

  let password: string = $state('');
  let passwordConfirm: string = $state('');
  let passwordValid = $derived.by(() => {
    return password && password === passwordConfirm;
  });
</script>

<h1 class="text-3xl text-gray-200">Welcome to Ob!</h1>

<form
  {...createInitialUser}
  class="max-w-md mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700"
>
  <h2 class="text-2xl font-bold text-gray-200 mb-2">Create Initial User</h2>
  <p class="text-gray-400 mb-6">Set up your initial user account.</p>

  <div class="space-y-4">
    <label class="block">
      <span class="text-sm font-medium text-gray-300 mb-1 block">Username</span>
      <input
        {...createInitialUser.fields.username.as('text')}
        class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium text-gray-300 mb-1 block">Email</span>
      <input
        {...createInitialUser.fields.email.as('email')}
        class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium text-gray-300 mb-1 block">Password</span>
      <input
        bind:value={password}
        {...createInitialUser.fields._password.as('password')}
        type="password"
        class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </label>

    <label class="block">
      <span class="text-sm font-medium text-gray-300 mb-1 block"
      >Confirm Password</span
      >
      <input
        name="passwordConfirm"
        bind:value={passwordConfirm}
        type="password"
        class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </label>

    {#if !passwordValid}
      <p class="text-red-400 text-sm">Passwords do not match.</p>
    {/if}
  </div>

  <button
    disabled={!passwordValid}
    {...createInitialUser.fields.actions.as('submit', 'createInitialUser')}
    name="createInitialUser"
    class="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
  >
    Create Initial User
  </button>
</form>
