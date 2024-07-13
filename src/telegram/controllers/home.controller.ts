import { Action, Ctx, Hears, Message, On, Start, Update } from "nestjs-telegraf";
import { Markup, Scenes } from "telegraf";


@Update()
export class HomeController {
    @On('text')
    async HearAllMessage(
        @Ctx() ctx: Scenes.SceneContext,
        @Message() msg: { 
            message_id: number; 
            text: string; 
            reply_to_message: { message_id: number; text: string } }
        ) {
        
    }

    
    @Start()
    async onStart(@Ctx() ctx: Scenes.SceneContext) {
        const keyboard = Markup.inlineKeyboard([
            [
                Markup.button.callback(
                "Who you are?",
                "who_you_are",
                )
            ],
        ]);
        await ctx.reply("Hello world!", { ...keyboard, parse_mode: 'Markdown' })
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            await ctx.deleteMessage();
        } catch (e) {}
        return false;
    }

    @Action('who_you_are')
    async handleQA(@Ctx() ctx: Scenes.SceneContext) {
        await ctx.reply("I'm a Hello world telegram bot!")
    }
}