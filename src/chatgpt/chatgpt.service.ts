import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map, of } from 'rxjs';

interface IGptAnswer {
    id: string;
    object: string;
    created: number;
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    choices: {
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
        index: number;
    }[];
}

@Injectable()
export class ChatgptService {
    private readonly logger = new Logger(ChatgptService.name);
    private gptUrl;
    private apiKey;
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.gptUrl = 'https://api.openai.com/v1/chat/completions';
        this.apiKey = configService.get('GPT_API');
    }
    generateResponse(content: string) {
        const headers = {
            'Content-type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
        };
        const data = {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content }],
            temperature: 1,
        };
        return this.httpService.post<IGptAnswer>(this.gptUrl, data, { headers }).pipe(
            map(({ data }) => data.choices[0].message.content.trim()),
            catchError((err) => {
                this.logger.error(err);
                return of('Произошла ошибка');
            }),
        );
    }
}
