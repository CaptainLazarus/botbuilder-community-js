import { Middleware, TurnContext, ActivityTypes } from 'botbuilder';
import { Engine } from '@botbuildercommunity/middleware-engine-core';
import { CognitiveServiceEngine } from './engine';
import { TextAnalysisOptions } from './schema';

/**
 * @module botbuildercommunity/middleware-text-analytics
 */

export class SentimentAnalysis implements Middleware {
    public engine: Engine;
    public constructor(options: TextAnalysisOptions) {
        this.engine = new CognitiveServiceEngine(options);
    }
    public async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        if(context.activity.type === ActivityTypes.Message) {
            const input = {
                documents: [
                    {
                        'id': '1'
                        , 'text': context.activity.text
                    }
                ]
            };
            try {
                const result = await this.engine.sentiment(input);
                const s = result.documents[0].score;
                context.turnState.set('sentimentScore', s);
            }
            catch(e) {
                throw new Error(`Failed to process sentiment on ${ context.activity.text }. Error: ${ e }`);
            }
        }
        await next();
    }
}
