import { Telegraf } from 'telegraf';

import { UserRepository } from '../../../application/repositories/user-repository';
import { AuthenticateAdmin } from '../../../application/use-cases/authenticate-user';
import { config } from '../../../infrastructure/config';
import { MyContext } from '../scenes/registration.scene';

export function setupAdminCommand(bot: Telegraf<MyContext>, userRepository: UserRepository) {
  const authenticateAdmin = new AuthenticateAdmin(userRepository);

  bot.command('admin', async (ctx) => {
    const providedCode = ctx.message.text.split(' ')[1];

    if (!providedCode) {
      return ctx.reply('Пожалуйста, введите код доступа после команды /admin');
    }

    const isAuthenticated = await authenticateAdmin.execute(
      ctx.from.id,
      providedCode,
      config.adminHexCode
    );

    if (isAuthenticated) {
      ctx.reply('You have been successfully granted admin privileges.');
    } else {
      ctx.reply('Invalid access code or you are not registered. Please use /start first.');
    }
  });
}
