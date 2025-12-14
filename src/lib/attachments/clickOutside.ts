export function clickOutside(node: HTMLElement, onClickOutside: (node: HTMLElement) => void) {
  const handleClick = (event: MouseEvent) => {
    if (!node.contains(event.target as Node)) {
      onClickOutside(node);
    }
  };

  document.addEventListener('click', handleClick, true);
  document.addEventListener('contextmenu', handleClick, true);

  return () => {
    document.removeEventListener('click', handleClick, true);
    document.removeEventListener('contextmenu', handleClick, true);
  };
}