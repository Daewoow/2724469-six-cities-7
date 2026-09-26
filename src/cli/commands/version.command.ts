import { Command } from './command.interface.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type PackageJSONConfig = {
  version: string;
}

function isPackageJSONConfig(val: unknown): val is PackageJSONConfig {
  return (
    typeof val === 'object' &&
    val !== null &&
    !Array.isArray(val) &&
    Object.hasOwn(val, 'version')
  );
}

export class VersionCommand implements Command {
  constructor(
    private readonly filePath: string = './package.json'
  ) { }

  public getName(): string {
    return '--version';
  }

  public async execute(): Promise<void> {
    try {
      const version = this.readVersion();
      console.info(version);
    } catch (err: unknown) {
      console.error(`Не удалось прочитать версию из файла ${this.filePath}.`);
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error('Не удалось распарсить содержимое JSON.');
    }

    return importedContent.version;
  }
}