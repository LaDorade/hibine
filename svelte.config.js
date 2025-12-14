import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    experimental: {
      remoteFunctions: true
    },
    alias: {
      $components: 'src/lib/components',
      $stores: 'src/stores',
      $types: 'src/types',
      $utils: 'src/utils',
      $client: 'src/client',
      $core: 'src/lib/core',
      $plugins: 'src/lib/plugins',
    }
  },
  vitePlugin: {
    inspector: {
      toggleKeyCombo: 'meta-shift',
      showToggleButton: 'always',
      holdMode: false,
      toggleButtonPos: 'top-right'
    },
  },
  compilerOptions: {
    experimental: {
      async: true
    }
  },
};

export default config;
