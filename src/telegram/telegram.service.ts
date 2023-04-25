import { ConfigService } from '@nestjs/config';
import { Start, Update, Ctx, Message, On } from 'nestjs-telegraf';
import { ChatgptService } from 'src/chatgpt/chatgpt.service';
import { Scenes, Telegraf } from 'telegraf';

type Context = Scenes.SceneContext;

@Update()
export class TelegramService extends Telegraf<Context> {
    @Start()
    onStart(@Ctx() ctx: Context) {
        ctx.replyWithHTML(`<b>Привет, ${ctx.from.username}</b>
Это чат бот с ChatGPT!
Введите любую фразу и получите ответ!
        `);
    }
    @On('text')
    onMessage(@Message('text') msg: string, @Ctx() ctx: Context) {
        ctx.replyWithHTML(`<i>${msg}</i>`);
    }
}
