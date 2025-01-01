"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAllQuestionChannels = void 0;
const discord_js_1 = require("discord.js");
const BCONST_1 = require("./BCONST");
const DOBuilder_1 = require("./data/DOBuilder");
const Errors_1 = require("./Errors");
const new_1 = require("./new");
async function startAllQuestionChannels(client) {
    let result = 0;
    let question_channels = await DOBuilder_1.DO.getQuestionChannels();
    for (let i = 0; i < question_channels.length; i++) {
        let qc = question_channels[i];
        let channel = await client.channels.cache.get(qc.getChannel());
        if (typeof channel === 'undefined')
            result = Errors_1.GameInteractionErr.GuildDataUnavailable;
        channel = channel;
        // get the last submitted question to the question channel, and resubmit it.
        let latest_question = await DOBuilder_1.DO.getLatestAskedQuestion(qc.getChannel());
        if (latest_question.length > 0) {
            // inform the user of the err
            let thumbnail = BCONST_1.BCONST.MAXIMUS_IMAGES[Math.floor(Math.random() * BCONST_1.BCONST.MAXIMUS_IMAGES.length)].url;
            const embed = new discord_js_1.EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({ text: 'Barbie Trivia', iconURL: BCONST_1.BCONST.LOGO });
            embed.setTitle('**Restart Error**');
            let description = `There appeared to have been an error. The last question is going to be re-submitted, and all users will need to reply again. We apologize for any inconvinence this may cause.`;
            embed.setDescription(description);
            channel.send({ embeds: [embed] });
            // create the new question
            (0, new_1.createNewQuestion)(qc.getServer(), qc.getChannel(), client, latest_question[0].getQuestionID());
        }
    }
}
exports.startAllQuestionChannels = startAllQuestionChannels;
