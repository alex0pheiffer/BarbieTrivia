import { Channel, Client, EmbedBuilder, TextChannel } from "discord.js";
import { BCONST } from "./BCONST";
import { DO } from "./data/DOBuilder";
import { GameInteractionErr } from "./Errors";
import { createNewQuestion } from "./new";
import { showQuestionResult } from "./question_cycle";
import { PlayerAnswerO } from "./data/data_objects/playerAnswer";
import { gameStillActive } from "./end";

export async function startAllQuestionChannels(client: Client) {
    let result = 0;
    
    let question_channels = await DO.getQuestionChannels();
    for (let i=0; i < question_channels.length; i++) {
        let qc = question_channels[i];

        console.log("checking if game is active (startup)");
        if (!(await gameStillActive(qc.getChannel(), client))) {
            console.log(`The game in channel  ${qc.getChannel()} is no longer active.`)
            result = GameInteractionErr.GameDoesNotExist;
            continue;
        }
        console.log("game is active?: ", result)

        let channel: Channel | undefined = await client.channels.cache.get(qc.getChannel());
        if (typeof channel === 'undefined') {
            console.log(`Unable to find channel ${qc.getChannel()}`)
            result = GameInteractionErr.GuildDataUnavailable;
            continue;
        }
        channel = channel as TextChannel;
        
        // get the last submitted question to the question channel, and resubmit it.
        let latest_question = await DO.getLatestAskedQuestion(qc.getChannel());
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
                // collect the responses to this question
                let responses_raw = await DO.getPlayerAnswers(latest_question[0].getAskID());
                // filter responses to only include answers that were _submitted_
                let responses: PlayerAnswerO[] = [];
                responses_raw.forEach((r, i) => {
                    if (r.getSubmtitted() > 0) {
                        responses.push(r);
                    }
                });
                // TODO check if channel is undefined; this can happen if the bot isn't in the server
                if (time - latest_question[0].getShowResultTime() >= 0 && responses.length > 1) {
                    console.log("Time to show the result");
                    let message = await channel.messages.fetch(latest_question[0].getMessageID());
                    showQuestionResult(message, latest_question[0].getAskID());
                }
                else {
                    let description = "";
                    if (responses.length < 2) {
                        if (responses.length < 1)
                            description = `Because nobody has responded to the trivia question, the question is being extended another 24 hours.`
                        else
                            description = `Because only one person has responded to the trivia question, the question is being extended another 24 hours.`
                    }
                    console.log("restart the same question");
                    let thumbnail = BCONST.MAXIMUS_IMAGES[Math.floor(Math.random()*BCONST.MAXIMUS_IMAGES.length)].url;
                    const embed = new EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
                    embed.setTitle('**Restart Error**');
                    description = `There appeared to have been an error. Please respond to the new prompt for your answers. (Previous answers are still recorded). ${description}`;
                    embed.setDescription(description);
                    channel.send({ embeds:[embed]});
                    let new_time_difference = latest_question[0].getShowResultTime() - time;
                    createNewQuestion(qc.getServer()!!, qc.getChannel(), client, latest_question[0].getQuestionID(), new_time_difference);
                    
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
                console.log("Question is not active.")
                if (time - latest_question[0].getNextQuestionTime() >= 0) {
                    console.log(`Question should have appeared at ${latest_question[0].getNextQuestionTime()}, which is after now (${time})`);
                    createNewQuestion(qc.getServer()!!, qc.getChannel(), client);
                }
                else {
                    console.log(`there are still ${latest_question[0].getNextQuestionTime()-time}ms until the next question,`);
                    setTimeout(createNewQuestion, latest_question[0].getNextQuestionTime()-time, qc.getServer(), qc.getChannel(), client);
                }
            }
        }            
    }
   
}