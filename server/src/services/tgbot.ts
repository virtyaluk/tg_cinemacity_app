/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import { Telegraf } from 'telegraf';
import { confirmPayment } from './booking.js';
import { Invoice } from '../models/services/db.js';

const botToken = process.env.BOT_TOKEN as string;
const providerToken = process.env.PROVIDER_TOKEN as string;
const bot = new Telegraf(botToken);
const WEB_APP_URL: string = 'https://lab.modern-dev.com/';

bot.telegram.setWebhook('https://lab.modern-dev.com/tgbot');

bot.use(Telegraf.log());

bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ ctx.updateType }`, err);
});

bot.start((ctx) => {
    ctx.replyWithMarkdownV2(`*Let's get started 🎥*\\\n\nPlease tap the button below to book your best movie\\!`, {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: 'Book the tickets',
                    // callback_data: '93453745893749',
                    web_app: {
                        url: WEB_APP_URL,
                    },
                },
            ]],
        },
    });

    ctx.setChatMenuButton({
        type: 'web_app',
        text: 'Cinema City',
        web_app: {
            url: WEB_APP_URL,
        },
    });
});

bot.help((ctx) => {
    ctx.reply('Send /start to receive a greeting');
});

bot.on('pre_checkout_query', (ctx) => {
    return ctx.answerPreCheckoutQuery(true);
});

bot.on('successful_payment', async (ctx) => {
    console.log('successful_payment', ctx.update.message.successful_payment);
    const invoiceId: string = ctx.update.message.successful_payment.invoice_payload;

    if (invoiceId) {
        await confirmPayment(invoiceId);

        await ctx.reply('SuccessfulPayment');
    } else {
        await ctx.reply('un________SuccessfulPayment');
    }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export const createInvoiceLink = async (invoice: Invoice): Promise<string> => {
    return await bot.telegram.createInvoiceLink({
        ...invoice,
        provider_token: providerToken,
        // @ts-ignore
        start_parameter: 'get_access',
        need_phone_number: true,
        // need_email: true,
    });
};

export default bot;
