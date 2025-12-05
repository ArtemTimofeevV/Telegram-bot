import { Scenes } from 'telegraf';

import { UserRepository } from '../../../application/repositories/user-repository';
import { RegisterUser } from '../../../application/use-cases/register-user';
import { User } from '../../../domain/entities/user';

// Определяем, какие данные будет хранить сессия этой сцены
interface RegistrationSceneSession extends Scenes.SceneSessionData {
    user: Partial<User>;
    step: number;
}

// Расширяем стандартный контекст, чтобы он знал о сессии нашей сцены
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MyContext extends Scenes.SceneContext<RegistrationSceneSession> {}

export function createRegistrationScene(userRepository: UserRepository) {
    const registerUserUseCase = new RegisterUser(userRepository);

    const registrationScene = new Scenes.BaseScene<MyContext>('registration');

    registrationScene.enter(async (ctx) => {
        if (!ctx.from) {
            await ctx.reply('Could not identify the user. Please try again.');
            return ctx.scene.leave();
        }
        ctx.scene.session.user = { id: ctx.from.id, username: ctx.from.username };
        ctx.scene.session.step = 0;
        await ctx.reply('Starting registration. Please enter your first name.');
    });

    registrationScene.on('text', async (ctx) => {
        const step = ctx.scene.session.step || 0;
        const text = ctx.message.text;

        switch (step) {
            case 0: { // First Name
                const nameRegex = /^[a-zA-Z]+$/;
                if (nameRegex.test(text)) {
                    ctx.scene.session.user.firstName = text;
                    ctx.scene.session.step = 1;
                    await ctx.reply('Great! Now, please enter your last name.');
                } else {
                    await ctx.reply('Invalid format. Please use letters only for your first name.');
                }
                break;
            }
            case 1: { // Last Name
                const lastNameRegex = /^[a-zA-Z]+$/;
                if (lastNameRegex.test(text)) {
                    ctx.scene.session.user.lastName = text;
                    ctx.scene.session.step = 2;
                    await ctx.reply('And finally, your date of birth (in DD.MM.YYYY format).');
                } else {
                    await ctx.reply('Invalid format. Please use letters only for your last name.');
                }
                break;
            }
            case 2: { // Date of Birth
                const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
                if (dateRegex.test(text)) {
                    ctx.scene.session.user.dateOfBirth = text;
                    await registerUserUseCase.execute(ctx.scene.session.user as Omit<User, 'role'>);
                    await ctx.reply('Congratulations, registration is complete! You have been registered as a \'User\'.');
                    await ctx.scene.leave();
                } else {
                    await ctx.reply('Invalid format. Please use DD.MM.YYYY format for your date of birth.');
                }
                break;
            }
        }
    });

    return registrationScene;
}