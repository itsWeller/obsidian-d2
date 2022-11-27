import { App, PluginSettingTab, Setting } from "obsidian";
import D2Plugin from "./main";

export interface D2PluginSettings {
	d2ExecutablePath: string;
	writeOutput: boolean;
	cleanInput: boolean;
}

export const DEFAULT_SETTINGS: D2PluginSettings = {
	d2ExecutablePath: "/usr/local/bin/d2",
	writeOutput: false,
	cleanInput: true,
};

export class D2SettingsTab extends PluginSettingTab {
	plugin: D2Plugin;

	constructor(app: App, plugin: D2Plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "D2 Plugin Settings" });

		new Setting(containerEl)
			.setName("D2 Path")
			.setDesc("Path to D2 executable.")
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_SETTINGS.d2ExecutablePath)
					.setValue(this.plugin.settings.d2ExecutablePath)
					.onChange(async (value) => {
						this.plugin.settings.d2ExecutablePath = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Generate SVG File")
			.setDesc(
				"Generate an SVG of the diagram in addition to rendering in the editor?"
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.writeOutput)
					.onChange(async (value) => {
						this.plugin.settings.writeOutput = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Clean Input File")
			.setDesc(
				"Delete temporary D2 input file after rendering in the editor?"
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.cleanInput)
					.onChange(async (value) => {
						this.plugin.settings.cleanInput = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
