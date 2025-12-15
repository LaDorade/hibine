export function clickOutside(node: HTMLElement, onClickOutside: (node: HTMLElement) => void) {
  const handleClick = (event: MouseEvent) => {
    if (!node.contains(event.target as Node)) {
      onClickOutside(node);
    }
  };

  document.addEventListener('mouseup', handleClick, true);
  document.addEventListener('contextmenu', handleClick, true);

  return () => {
    document.removeEventListener('mouseup', handleClick, true);
    document.removeEventListener('contextmenu', handleClick, true);
  };
}