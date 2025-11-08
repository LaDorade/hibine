import type { Options } from '$types/options';

const defaultOptions: Options = {
	autoSave: true
} as const;

class Settings {
	autoSave: boolean = $state(defaultOptions.autoSave);

	static getDefaults(): Options {
		return defaultOptions;
	}

	settings = $derived({
		autoSave: this.autoSave,
	});

	#firstLoad = true;
	load() {
		if (!this.#firstLoad) return;
		console.log('Loading settings from localStorage...');
		const savedSettings = localStorage.getItem('settings');
		if (savedSettings) {
			const parsedSettings = JSON.parse(savedSettings);
			this.autoSave = parsedSettings.autoSave ?? this.autoSave;
		}
		this.#firstLoad = false;
	}

	save() {
		console.log('Saving settings to localStorage...');
		const settingsToSave = {
			autoSave: this.autoSave,
		};
		localStorage.setItem('settings', JSON.stringify(settingsToSave));
	}
}

export const settings = new Settings();

const prox = (settings: Settings) => new Proxy(settings, {
	get(target, prop: string) {
		if (prop in target) {
			target.load();
			//@ts-expect-error Proxy dynamic access
			return target[prop];
		}
		return undefined;
	},
	set(target, prop, value) {
		if (prop in target) {
			//@ts-expect-error Proxy dynamic access
			target[prop] = value;
			target.save();
			return true;
		}
		return false;
	}
});

export const proxiedSettings = prox(settings);