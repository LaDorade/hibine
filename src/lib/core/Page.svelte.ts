import { pushState } from '$app/navigation';
import { resolve } from '$app/paths';
import { type CoreAPI } from './CoreAPI.svelte';
import { getCurrentTape } from '$lib/remotes/files.remote';
import { SvelteURL } from 'svelte/reactivity';

export class Page {
  constructor(private coreAPI: CoreAPI = coreAPI) {}

  async init() {
    await this.openFromUrl();
  }

  /**
	 * Open the tab from the URL parameter "active"
	 */
  async openFromUrl() {
    const url = new SvelteURL(window.location.href);
    const active = url.searchParams.get('active');
    if (active) {
      await this.coreAPI.openFileAtPath(decodeURIComponent(active), false);
    }
  }

  /**
	 * Sync the current page URL with the active tab
	 */
  async syncPage(id?: string | null) {
    // TODO: refacto to use URL classe (handle multiple params)
    //@ts-expect-error - SvelteURL type issue
    const newUrl = resolve(`/tape/[tape]?active=${encodeURIComponent(id ?? '')}`, {
      tape: await getCurrentTape()
    });
    pushState(newUrl, {});
  }
}