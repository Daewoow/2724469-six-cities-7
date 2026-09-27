import chalk from "chalk";
import { Command } from "./commands/command.interface.js";
import { CommandParser } from "./command-parser.js";

type CommandCollection = Record<string, Command>;

export class CLIApplication {
  constructor(private readonly defaultCommand: string = "--help") {}

  private commands: CommandCollection = {};

  public registerCommands(commandsList: Command[]) {
    commandsList.forEach((command) => {
      const commandName = command.getName();

      if (Object.hasOwn(this.commands, commandName)) {
        throw new Error(
          chalk.red(`Команда ${commandName} уже зарегистрирована.`),
        );
      }

      this.commands[commandName] = command;
    });
  }

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): Command | never {
    if (!this.commands[this.defaultCommand]) {
      throw new Error(
        chalk.red(
          `Команда по умолчанию (${this.defaultCommand}) не зарегистрирована.`,
        ),
      );
    }

    return this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArgs = parsedCommand[commandName] ?? [];
    command.execute(...commandArgs);
  }
}
