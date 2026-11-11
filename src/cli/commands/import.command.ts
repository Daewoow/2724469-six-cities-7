import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import {
  createOffer,
  getErrorMessage,
  getMongoURI,
} from '../../shared/helpers/index.js';
import { UserService } from '../../shared/modules/user/user-service.interface.js';
import {
  DefaultOfferService,
  OfferModel,
  OfferService,
} from '../../shared/modules/offer/index.js';
import {
  DatabaseClient,
  MongoDatabaseClient,
} from '../../shared/libs/database-client/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import {
  DefaultUserService,
  UserModel,
} from '../../shared/modules/user/index.js';
import {
  DEFAULT_DB_PORT,
  DEFAULT_USER_PASSWORD,
} from '../../shared/constants/constants.command.js';
import { Offer } from '../../shared/types/index.js';
import chalk from 'chalk';
import { CommentModel } from '../../shared/modules/comment/comment.entity.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private readonly logger: Logger;
  private salt!: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(
      this.logger,
      OfferModel,
      CommentModel,
    );
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`Импортировано ${count} строк.`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate(
      {
        ...offer.author,
        password: DEFAULT_USER_PASSWORD,
      },
      this.salt,
    );

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      postDate: offer.postDate,
      city: offer.city,
      previewImage: offer.previewImage,
      images: offer.images,
      isPremium: offer.isPremium,
      housingType: offer.housingType,
      rooms: offer.rooms,
      guests: offer.guests,
      price: offer.price,
      amenities: offer.amenities,
      author: user.id,
      coordinates: offer.coordinates,
    });
  }

  public getName(): string {
    return '--import';
  }

  public async execute(
    filename: string,
    login: string,
    password: string,
    host: string,
    dbname: string,
    salt: string,
  ): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(
        chalk.red(`Не удалось импортировать данные из файла: ${filename}.`),
      );
      console.error(chalk.red(getErrorMessage(error)));
    }
  }
}
