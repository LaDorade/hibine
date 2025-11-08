export function tooltip(node: HTMLElement, message: string) {
	const tooltip = document.createElement('div');
	tooltip.textContent = message;
	tooltip.className = 'tooltip';
	document.body.appendChild(tooltip);

	const { top, left, width } = node.getBoundingClientRect();
	tooltip.style.position = 'absolute';
	tooltip.style.top = `${top}px`;
	tooltip.style.left = `${left + width / 2}px`;

	node.addEventListener('mouseenter', () => {
		tooltip.style.visibility = 'visible';
	});
	node.addEventListener('mouseleave', () => {
		tooltip.style.visibility = 'hidden';
	});
}