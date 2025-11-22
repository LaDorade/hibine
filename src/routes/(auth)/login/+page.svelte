<script lang="ts">
    import { login } from '$lib/remotes/users.remote';

    let username: string = $state('');
    let password: string = $state('');
    let isPasswordValid: boolean = $derived.by(() => {
    	return password.length >= 3;
    });
</script>

<div class="w-screen h-screen flex items-center justify-center bg-gray-900">
    <form
        class="bg-gray-800 p-8 rounded shadow-md w-96"
				{...login}
    >
        <h2 class="text-2xl font-bold mb-6 text-center text-white">Login</h2>
        <div class="mb-4">
            <label class="block text-gray-300 mb-2" for="username">Username</label>
            <input
								{...login.fields.username.as('text')}
                {@attach (node: HTMLInputElement) => node.focus()}
                bind:value={username}
                class="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
            />
        </div>
        <div class="mb-4">
            <label class="block text-gray-300 mb-2" for="password"
                >Password</label
            >
            <input
								{...login.fields._password.as('password')}
                bind:value={password}
								autocomplete="current-password"
                class="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
            />
        </div>
        <button
						{...login.buttonProps}
						disabled={!isPasswordValid}
            class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
            Login
        </button>
    </form>
</div>
