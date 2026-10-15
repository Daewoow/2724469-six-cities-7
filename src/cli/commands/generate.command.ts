import chalk from 'chalk';
import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  private async load(url: string) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(chalk.red(`Не удалось загрузить данные с ${url}.`));
      }

      this.initialData = await response.json();
    } catch {
      throw new Error(chalk.red(`Не удалось загрузить данные из ${url}.`));
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(chalk.cyan.bold(`Файл ${filepath} создан!`));
    } catch (error: unknown) {
      console.error(chalk.red('Не удалось сгенерировать данные.'));

      console.error(chalk.red(getErrorMessage(error)));
    }
  }
}
