"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAllQuestionChannels = void 0;
const discord_js_1 = require("discord.js");
const BCONST_1 = require("./BCONST");
const DOBuilder_1 = require("./data/DOBuilder");
const Errors_1 = require("./Errors");
const new_1 = require("./new");
const question_cycle_1 = require("./question_cycle");
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
            console.log("Latest ask_id: ", latest_question[0].getAskID());
            // inform the user of the err
            // let thumbnail = BCONST.MAXIMUS_IMAGES[Math.floor(Math.random()*BCONST.MAXIMUS_IMAGES.length)].url;
            // const embed = new EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
            // embed.setTitle('**Restart Error**');
            // let description = `There appeared to have been an error. The last question is going to be re-submitted, and all users will need to reply again. We apologize for any inconvinence this may cause.`;
            // embed.setDescription(description);
            // channel.send({ embeds:[embed]});
            // create the new question
            const d = new Date();
            let time = d.getTime();
            if (latest_question[0].getActive() > 0) {
                console.log("Question is active");
                // pretend this question has reached its time limit (even though it hasn't) and move on to the next question
                // get the message id
                // TODO check if channel is undefined; this can happen if the bot isn't in the server
                if (time - latest_question[0].getShowResultTime() >= 0) {
                    console.log("Time to show the result");
                    let message = await channel.messages.fetch(latest_question[0].getMessageID());
                    console.log(message);
                    (0, question_cycle_1.showQuestionResult)(message, latest_question[0].getAskID());
                }
                else {
                    console.log("restart the same question");
                    let thumbnail = BCONST_1.BCONST.MAXIMUS_IMAGES[Math.floor(Math.random() * BCONST_1.BCONST.MAXIMUS_IMAGES.length)].url;
                    const embed = new discord_js_1.EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({ text: 'Barbie Trivia', iconURL: BCONST_1.BCONST.LOGO });
                    embed.setTitle('**Restart Error**');
                    let description = `There appeared to have been an error. Please respond to the new prompt for your answers. (Previous answers are still recorded).`;
                    embed.setDescription(description);
                    channel.send({ embeds: [embed] });
                    let new_time_difference = latest_question[0].getShowResultTime() - time;
                    (0, new_1.createNewQuestion)(qc.getServer(), qc.getChannel(), client, latest_question[0].getQuestionID(), new_time_difference);
                    // let latest_question_remake = await DO.getLatestAskedQuestion(qc.getChannel());
                    // if (latest_question_remake.length > 0) {
                    //     console.log("Latest Question Remake ask_id: ", latest_question_remake[0].getAskID())
                    //     let responses = await DO.getPlayerAnswers(latest_question[0].getAskID());
                    //     for (let i=0; i < responses.length; i++) {
                    //         responses[i].setAskID(latest_question_remake[0].getAskID());
                    //         result = await DO.updatePlayerAnswer(responses[i], result);
                    //     }
                    // }
                    // // TODO edit the embed to reflect that we know this many people have answered so far
                    // else {
                    //     console.log("Newest Question not created properly");
                    // }
                }
                //createNewQuestion(qc.getServer()!!, qc.getChannel(), client, latest_question[0].getQuestionID());
            }
            else {
                console.log("Question is not active.");
                if (time - latest_question[0].getNextQuestionTime() >= 0) {
                    console.log(`Question should have appeared at ${latest_question[0].getNextQuestionTime()}, which is after now (${time})`);
                    (0, new_1.createNewQuestion)(qc.getServer(), qc.getChannel(), client);
                }
                else {
                    console.log(`there are still ${latest_question[0].getNextQuestionTime() - time}ms until the next question,`);
                    setTimeout(new_1.createNewQuestion, latest_question[0].getNextQuestionTime() - time, qc.getServer(), qc.getChannel(), client);
                }
            }
        }
    }
}
exports.startAllQuestionChannels = startAllQuestionChannels;
