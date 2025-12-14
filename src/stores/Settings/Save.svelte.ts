export class SaveSettings {
  saving: boolean = $state(false);
  autoSave: boolean = $state(true);

  static getDefaults() {
    return {
      autoSave: true
    } as const;
  }
}