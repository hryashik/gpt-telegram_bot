import { ConfigService } from '@nestjs/config';
import { Start, Update, Ctx, Message, On } from 'nestjs-telegraf';
import { ChatgptService } from '@/chatgpt/chatgpt.service';
import { Scenes, Telegraf } from 'telegraf';
import { Logger } from '@nestjs/common';

type Context = Scenes.SceneContext;

@Update()
export class TelegramService extends Telegraf<Context> {
    private readonly logger = new Logger(ChatgptService.name);
    constructor(
        private readonly configService: ConfigService,
        private readonly gpt: ChatgptService,
    ) {
        super(configService.get('TELEGRAM_API'));
    }
    @Start()
    onStart(@Ctx() ctx: Context) {
        ctx.replyWithHTML(`<b>Привет, ${ctx.from.username}</b>
Это чат бот с ChatGPT!
Введите любую фразу и получите ответ!
        `);
    }
    @On('text')
    onMessage(@Message('text') msg: string, @Ctx() ctx: Context) {
        this.logger.log(msg);
        return this.gpt.generateResponse(msg);
    }
}
