import chalk from "chalk";
import { Command } from "./command.interface.js";

export class HelpCommand implements Command {
  public getName(): string {
    return "--help";
  }

  public async execute(): Promise<void> {
    console.info(`
        ${chalk.bold.cyan("CLI для генерации данных")}

        ${chalk.bold("Пример:")}
            main.cli.js ${chalk.cyan("--<command>")} ${chalk.yellow("[--arguments]")}

        ${chalk.bold("Команды:")}
            ${chalk.green("--version:")}                   ${chalk.gray("# выводит номер версии")}
            ${chalk.green("--help:")}                      ${chalk.gray("# печатает этот текст")}
            ${chalk.green("--import")} ${chalk.yellow("<path>")}:             ${chalk.gray("# импортирует данные из TSV")}
    `);
  }
}
