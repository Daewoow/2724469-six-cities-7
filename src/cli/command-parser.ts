type ParserCommand = Record<string, string[]>;

export class CommandParser {
  static parse(cliArguments: string[]): ParserCommand {
    const parsedCommand: ParserCommand = {};
    let currentCommand = '';

    for (const arg of cliArguments) {
      if (arg.startsWith('--')) {
        currentCommand = arg;
        parsedCommand[currentCommand] = [];
      } else if (currentCommand && arg) {
        parsedCommand[currentCommand].push(arg);
      }
    }

    return parsedCommand;
  }
}
