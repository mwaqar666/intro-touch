import { readFile } from "node:fs/promises";
import { basename, dirname } from "node:path";
import { cwd } from "node:process";
import type { OnLoadArgs, OnLoadResult, Plugin, PluginBuild } from "esbuild";
import type { ParsedCommandLine, TranspileOutput } from "typescript";
import { default as typescript } from "typescript";
import type { Nullable, Optional } from "@/stacks/types";

export const esBuildDecoratorPlugin: Plugin = {
	name: "esbuildDecorator",
	setup: (build: PluginBuild): void => {
		let parsedTsConfig: Nullable<ParsedCommandLine> = null;

		build.onLoad({ filter: /\.ts$/ }, async (onLoadArgs: OnLoadArgs): Promise<OnLoadResult> => {
			if (!parsedTsConfig) {
				const fileName: Optional<string> = typescript.findConfigFile(cwd(), typescript.sys.fileExists);
				if (!fileName) throw new Error(`Failed to open "${fileName}"`);

				const fileContents: Optional<string> = typescript.sys.readFile(fileName);
				if (!fileContents) throw new Error(`Failed to read "${fileName}"`);

				const result = typescript.parseConfigFileTextToJson(fileName, fileContents);
				if (result.error) console.log(result.error);

				const loadedConfig = result.config;
				const baseDir: string = dirname(fileName);

				parsedTsConfig = typescript.parseJsonConfigFileContent(loadedConfig, typescript.sys, baseDir);
				parsedTsConfig.errors.forEach((diagnostic: typescript.Diagnostic) => console.log(diagnostic));
			}

			const typescriptFile: string = await readFile(onLoadArgs.path, "utf8");

			const program: TranspileOutput = typescript.transpileModule(typescriptFile, {
				compilerOptions: parsedTsConfig.options,
				fileName: basename(onLoadArgs.path),
			});

			return { contents: program.outputText };
		});
	},
};
