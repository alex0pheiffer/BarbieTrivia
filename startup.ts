import { Channel, Client, EmbedBuilder, TextChannel } from "discord.js";
import { BCONST } from "./BCONST";
import { DO } from "./data/DOBuilder";
import { GameInteractionErr } from "./Errors";
import { createNewQuestion } from "./new";
import { showQuestionResult } from "./question_cycle";

export async function startAllQuestionChannels(client: Client) {
    let result = 0;
    
    let question_channels = await DO.getQuestionChannels();
    for (let i=0; i < question_channels.length; i++) {
        let qc = question_channels[i];

        let channel: Channel | undefined = await client.channels.cache.get(qc.getChannel());
        if (typeof channel === 'undefined') result = GameInteractionErr.GuildDataUnavailable;
        channel = channel as TextChannel;
        
        // get the last submitted question to the question channel, and resubmit it.
        let latest_question = await DO.getLatestAskedQuestion(qc.getChannel());
        if (latest_question.length > 0) {
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
                // pretend this question has reached its time limit (even though it hasn't) and move on to the next question
                // get the message id
                let message = await channel.messages.fetch(latest_question[0].getMessageID());
                if (time - (latest_question[0].getDate() + BCONST.TIME_UNTIL_ANSWER) >= 0) {
                    showQuestionResult(message, latest_question[0].getAskID());
                }
                else {
                    let thumbnail = BCONST.MAXIMUS_IMAGES[Math.floor(Math.random()*BCONST.MAXIMUS_IMAGES.length)].url;
                    const embed = new EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
                    embed.setTitle('**Restart Error**');
                    let description = `There appeared to have been an error. Please respond to the new prompt for your answers. (Previous answers are still recorded).`;
                    embed.setDescription(description);
                    channel.send({ embeds:[embed]});
                    // change this question to be inactive since we will make a new one
                    latest_question[0].setActive(0);
                    result = await DO.updateAskedQuestion(latest_question[0], result);
                    createNewQuestion(qc.getServer()!!, qc.getChannel(), client, latest_question[0].getQuestionID());
                    // change all previous answers to that asked_question to the new question
                    let latest_question_remake = await DO.getLatestAskedQuestion(qc.getChannel());
                    if (latest_question_remake.length > 0) {
                        let responses = await DO.getPlayerAnswers(latest_question[0].getAskID());
                        for (let i=0; i < responses.length; i++) {
                            responses[i].setAskID(latest_question_remake[0].getAskID());
                            result = await DO.updatePlayerAnswer(responses[i], result);
                        }
                    }
                    // TODO edit the embed to reflect that we know this many people have answered so far
                    else {
                        console.log("Newest Question not created properly");
                    }
                }
                //createNewQuestion(qc.getServer()!!, qc.getChannel(), client, latest_question[0].getQuestionID());
            }
            else {
                if (time - latest_question[0].getNextQuestionTime() <= 0) {
                    createNewQuestion(qc.getServer()!!, qc.getChannel(), client);
                }
                else {
                    setTimeout(createNewQuestion, time - latest_question[0].getNextQuestionTime(), qc.getServer(), qc.getChannel(), client);
                }
            }
        }            
    }
   
}