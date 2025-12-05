import { Telegraf, Scenes, session } from 'telegraf';

import { config } from '../infrastructure/config';
import { PostgresUserRepository } from '../infrastructure/persistence/postgres-user-repository';
import { setupAdminCommand } from './bot/commands/admin';
import { setupStartCommand } from './bot/commands/start';
import { createRegistrationScene, MyContext } from './bot/scenes/registration.scene';

async function bootstrap() {
  const bot = new Telegraf<MyContext>(config.botToken);
  const userRepository = new PostgresUserRepository();

  const registrationScene = createRegistrationScene(userRepository);
  const stage = new Scenes.Stage<MyContext>([registrationScene], {
    // Removed default scene to avoid accidental re-triggering
  });

  bot.use(session());
  bot.use(stage.middleware());

  setupStartCommand(bot, userRepository);
  setupAdminCommand(bot, userRepository);

  bot.launch(() => {
    console.log('Бот запущен...');
  });

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

bootstrap();