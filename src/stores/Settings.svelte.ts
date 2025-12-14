import { SaveSettings } from './Settings/Save.svelte';
import type { Options } from '$types/options';

const defaultOptions: Options = {
  autoSave: true
} as const;

class Settings {
  saveSet = $state(new SaveSettings());

  static getDefaults(): Options {
    return defaultOptions;
  }

  #settings: Options = $derived({
    autoSave: this.saveSet.autoSave,
  });

  #firstLoad = true;
  load() {
    if (!this.#firstLoad) return;
    console.log('Loading settings from localStorage...');
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);

      this.saveSet.autoSave = parsedSettings.autoSave ?? this.saveSet.autoSave;
    }
    this.#firstLoad = false;
  }

  save() {
    console.log('Saving settings to localStorage...');
    const settingsToSave = {
      autoSave: this.saveSet,
    };
    localStorage.setItem('settings', JSON.stringify(settingsToSave));
  }

  get(settingKey: keyof Options) {
    return this.#settings[settingKey];
  }

  update(newSettings: Partial<Options>) {
    if (newSettings.autoSave !== undefined) {
      this.saveSet.autoSave = newSettings.autoSave;
    }
    this.save();
  }
}

export const settings = new Settings();
