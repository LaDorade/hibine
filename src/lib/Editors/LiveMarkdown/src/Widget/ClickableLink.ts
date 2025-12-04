import { WidgetType } from '@codemirror/view';

export class ClickableLinkWidget extends WidgetType {
	link: string;
	content: string;
	constructor(link: string, content?: string) {
		super();
		this.link = link;
		this.content = content || link;
	}

	override eq(other: ClickableLinkWidget) { 
		return other.link === this.link && other.content === this.content;
	}

	toDOM() {
		const a = document.createElement('a');
		a.href = this.link;
		a.textContent = this.content;
		a.target = '_blank';
		a.className = 'rtm-link';
		return a;
	}

	override ignoreEvent() {
		return true;
	}
}
