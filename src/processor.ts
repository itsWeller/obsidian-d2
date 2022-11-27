import { unlinkSync, readFileSync } from "fs";
import { unlink, writeFile } from "fs/promises";
import { spawn } from "child_process";

import { tmpName } from "src/utils";
import D2Plugin from "./main";

export class D2Processor {
	plugin: D2Plugin;

	constructor(plugin: D2Plugin) {
		this.plugin = plugin;
	}

	private async prepareOutput(inputFilePath: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const cmdPath = this.plugin.settings.d2ExecutablePath;
			const {
				writeOutput: shouldWriteOutput,
				cleanInput: shouldCleanupInput,
			} = this.plugin.settings;

			const outputFilePath = shouldWriteOutput
				? tmpName({ postfix: ".svg" })
				: "/dev/stdout";
			const parameters = [inputFilePath, outputFilePath];

			const outputData: Array<string> = [];
			const errorData: Array<string> = [];

			const d2Proc = spawn(cmdPath, parameters);

			d2Proc.stdin.end();
			d2Proc.stdout.on("data", function (data) {
				outputData.push(data.toString());
			});
			d2Proc.stderr.on("data", function (data) {
				errorData.push(data.toString());
			});
			d2Proc.on("error", (err: Error) => {
				reject(`"${cmdPath} ${parameters}" failed\n${err}`);
			});
			d2Proc.on("exit", (code) => {
				if (code === 0) {
					if (shouldCleanupInput) {
						unlinkSync(inputFilePath);
					}

					resolve(
						shouldWriteOutput
							? readFileSync(outputFilePath).toString()
							: outputData.join("")
					);
				} else {
					reject(
						`"${cmdPath} ${parameters}" failed with exit code ${code}\n${errorData.join(
							""
						)}`
					);
				}
			});
		});
	}

	private async prepareInput(input: string): Promise<string> {
		const inputFilePath = tmpName({ prefix: "input-", postfix: ".d2" });
		await writeFile(inputFilePath, input);
		return inputFilePath;
	}

	private renderDiagram(output: string, el: HTMLElement) {
		el.insertAdjacentHTML("afterbegin", output);
	}

	private renderError(el: HTMLElement, err: string) {
		const pre = document.createElement("pre");
		const code = document.createElement("code");
		pre.appendChild(code);
		code.setText(err);
		el.appendChild(pre);
	}

	public async process(source: string, target: HTMLElement): Promise<void> {
		try {
			const inputFilePath = await this.prepareInput(source);
			const outputData = await this.prepareOutput(inputFilePath);
			this.renderDiagram(outputData, target);
		} catch (err) {
			this.renderError(target, err);
		}
	}
}
