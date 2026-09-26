import { Command } from './command.interface.ts';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(): Promise<void> {
    console.info(`
        CLI для генерации данных
        Пример:
            main.cli.js --<command> [--arguments]
        Команды:
            --version:                   # выводит номер версии
            --help:                      # печатает этот текст
            --import <path>:             # импортирует данные из TSV
    `);
  }
}