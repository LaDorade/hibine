import { SaveSettings } from './Settings/Save.svelte';
import type { Options } from '$types/options';

const defaultOptions: Options = {
  lineWrap: true,
  lineNumbers: false,
} as const;

class Settings {
  saveSet = $state(new SaveSettings());

  static getDefaults(): Options {
    return defaultOptions;
  }

  #settings: Options = $state({
    lineWrap: defaultOptions.lineWrap,
    lineNumbers: defaultOptions.lineNumbers,
  });

  #firstLoad = true;
  load() {
    if (!this.#firstLoad) return;
    console.log('Loading settings from localStorage...');
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);

      this.#settings.lineWrap = parsedSettings.lineWrap ?? this.#settings.lineWrap;
      this.#settings.lineNumbers = parsedSettings.lineNumbers ?? this.#settings.lineNumbers;
    }
    this.#firstLoad = false;
  }

  save() {
    console.log('Saving settings to localStorage...');
    const settingsToSave = {
      lineWrap: this.#settings.lineWrap,
      lineNumbers: this.#settings.lineNumbers,
    };
    localStorage.setItem('settings', JSON.stringify(settingsToSave));
  }

  get(settingKey: keyof Options) {
    return this.#settings[settingKey];
  }

  set (settingKey: keyof Options, value: boolean) {
    this.#settings[settingKey] = value;
    this.save();
  }

  update(newSettings: Partial<Options>) {
    this.#settings = { ...this.#settings, ...newSettings };
    this.save();
  }
}

export const settings = new Settings();
