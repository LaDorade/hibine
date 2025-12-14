class ViewportStore {
  width = $state(0);
  height = $state(0);
  isMobile = $derived(this.width < 768);
  isTablet = $derived(this.width >= 768 && this.width < 1024);
  isDesktop = $derived(this.width >= 1024);

  isMobileSidebarOpen = $state(false);

  updateDimensions() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }
}

export const viewportStore = new ViewportStore();
