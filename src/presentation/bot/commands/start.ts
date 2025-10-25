import {Telegraf} from 'telegraf';

import {UserRepository} from '../../../application/repositories/user-repository';
import {MyContext} from '../scenes/registration.scene';

export function setupStartCommand(bot: Telegraf<MyContext>, userRepository: UserRepository) {
    bot.start(async (ctx) => {
        const user = await userRepository.findById(ctx.from.id);
        if (user) {
            ctx.reply(`Welcome back, ${user.firstName}!`);
        } else {
             await ctx.scene.enter('registration');
        }
    });
}