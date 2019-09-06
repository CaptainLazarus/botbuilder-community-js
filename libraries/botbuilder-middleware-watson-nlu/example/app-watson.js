const { BotFrameworkAdapter } = require("botbuilder");
const restify = require("restify");
const { EmotionDetection } = require("../lib/index");

require("dotenv").config();

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});

adapter.use(new EmotionDetection({ apiKey: process.env.WATSON_API_KEY, endpoint: process.env.WATSON_ENDPOINT, version: '2018-11-16' }));

server.post("/api/messages", (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        if (context.activity.type === "message") {
            await context.sendActivity(`You said "${context.activity.text} with an emotion score of [joy] at ${context.turnState.get("emotionDetection").joy}"`);
        } else {
            await context.sendActivity(`[${context.activity.type} event detected]`);
        }
    });
});
