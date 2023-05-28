import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { inspect } from "node:util";
import type { OnLoadArgs, OnLoadResult, Plugin, PluginBuild } from "esbuild";
import type { ParsedCommandLine, TranspileOutput } from "typescript";
import { default as typescript } from "typescript";
import type { Nullable, Optional } from "@/stacks/types";

const printDiagnostics = (...args: Array<unknown>): void => {
	console.log(inspect(args, false, 10, true));
};

export const esBuildDecorator: Plugin = {
	name: "esbuildDecorator",
	setup: (build: PluginBuild): void => {
		let parsedTsConfig: Nullable<ParsedCommandLine> = null;

		build.onLoad({ filter: /\.ts$/ }, async (onLoadArgs: OnLoadArgs): Promise<Optional<OnLoadResult>> => {
			if (!parsedTsConfig) {
				const fileName: Optional<string> = typescript.findConfigFile(cwd(), typescript.sys.fileExists);
				if (!fileName) throw new Error(`Failed to open "${fileName}"`);

				const fileContents: Optional<string> = typescript.sys.readFile(fileName);
				if (!fileContents) throw new Error(`Failed to read "${fileName}"`);

				const result = typescript.parseConfigFileTextToJson(fileName, fileContents);
				if (result.error) {
					printDiagnostics(result.error);
					throw new Error(`Failed to parse "${fileName}"`);
				}

				const loadedConfig = result.config;
				const baseDir: string = path.dirname(fileName);

				parsedTsConfig = typescript.parseJsonConfigFileContent(loadedConfig, typescript.sys, baseDir);
				if (parsedTsConfig.errors[0]) printDiagnostics(parsedTsConfig.errors);
			}

			const typescriptFile: string = await readFile(onLoadArgs.path, "utf8");

			const program: TranspileOutput = typescript.transpileModule(typescriptFile, {
				compilerOptions: parsedTsConfig.options,
				fileName: path.basename(onLoadArgs.path),
			});

			return { contents: program.outputText };
		});
	},
};
