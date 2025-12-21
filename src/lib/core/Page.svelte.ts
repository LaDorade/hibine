import { pushState, replaceState } from '$app/navigation';
import { resolve } from '$app/paths';
import { getCurrentTape } from '$lib/remotes/files.remote';
import { SvelteURL } from 'svelte/reactivity';
import type { CoreAPI } from './CoreAPI.svelte';

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
  async pushPage(id?: string | null) {
    // TODO: refacto to use URL classe (handle multiple params)
    const url = new SvelteURL(window.location.href);
    if (!id) {
      url.searchParams.delete('active');
    } else {
      url.searchParams.set('active', id ? encodeURIComponent(id) : '');
    }
    //@ts-expect-error - Svelte resolve type issue
    const newUrl = resolve(`/tape/[tape]?${url.searchParams.toString()}`, {
      tape: await getCurrentTape()
    });
    pushState(newUrl, {});
  }

  async replacePage(id?: string | null) {
    const url = new SvelteURL(window.location.href);
    if (!id) {
      url.searchParams.delete('active');
    } else {
      url.searchParams.set('active', id ? encodeURIComponent(id) : '');
    }
    //@ts-expect-error - Svelte resolve type issue
    const newUrl = resolve(`/tape/[tape]?${url.searchParams.toString()}`, {
      tape: await getCurrentTape()
    });
    replaceState(newUrl, {});
  }
}