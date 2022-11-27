import { App, Editor, MarkdownView, Modal, Notice, Plugin } from "obsidian";
import { D2Processor } from "src/processor";
import {
	D2PluginSettings,
	D2SettingsTab,
	DEFAULT_SETTINGS,
} from "src/settings";

export default class D2Plugin extends Plugin {
	settings: D2PluginSettings;

	async onload() {
		await this.loadSettings();
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new D2SettingsTab(this.app, this));
		const processor = new D2Processor(this);

		this.app.workspace.onLayoutReady(() => {
			this.registerMarkdownCodeBlockProcessor(
				"d2",
				processor.process.bind(processor)
			);
		});
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
		console.log("settings", this.settings);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
