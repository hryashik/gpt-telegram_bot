import { ConfigService } from '@nestjs/config';
import { Start, Update, Ctx, Message, On } from 'nestjs-telegraf';
import { ChatgptService } from '@/chatgpt/chatgpt.service';
import { Scenes, Telegraf } from 'telegraf';
import { Logger } from '@nestjs/common';
import { greetings } from './text-templates/greetings';

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
        ctx.replyWithHTML(greetings(ctx.from.username || ctx.from.first_name));
    }
    @On('text')
    onMessage(@Message('text') msg: string, @Ctx() ctx: Context) {
        return this.gpt.generateResponse(msg);
    }
}
