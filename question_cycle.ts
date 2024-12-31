import { Channel, EmbedBuilder, Message, TextChannel } from "discord.js";
import { BCONST } from "./BCONST";
import { AskedQuestionO } from "./data/data_objects/askedQuesetion";
import { PlayerAnswerO } from "./data/data_objects/playerAnswer";
import { DO } from "./data/DOBuilder";
import { GameInteractionErr } from "./Errors";
import { PlayerI } from "./data/data_interfaces/player";
import { createNewQuestion } from "./new";

export async function showQuestionResult(message: Message, ask_id: number): Promise<Number> {
    console.log("Enterinig question result.");
    let result = 0;

    // question
    let asked_questions = await DO.getAskedQuestionByAskID(ask_id);
    let asked_question: AskedQuestionO;
    if (asked_questions.length < 1) {
        result = GameInteractionErr.QuestionDoesNotExist;
    }
    else {
        asked_question = asked_questions[0];
    }
    if (!result) {
        let question = await DO.getQuestion(asked_question!!.getQuestionID())
        if (question == null) {
            result = GameInteractionErr.QuestionDoesNotExist;
        }
        else {
            // collect the responses to this question
            let responses = await DO.getPlayerAnswers(ask_id);
            if (responses.length < 1) {
                result = GameInteractionErr.NoPlayerResponses;
                // if no responses have been recorded, extend the life of this question.
                // TODO
            }
            else {
                let r: PlayerAnswerO;
                // these are the REAL VALUES (not the shuffled values)
                let count = [0,0,0,0];
                for (let i=0; i < responses.length; i++) {
                    r = responses[i];
                    if (r.getSubmtitted()) {
                        count[r.getResponse()]++;
                    }

                    // update the player's information
                    // check if this user has a profile. if not, create one.
                    let player_profile = await DO.getPlayer(r.getUser());
                    let correct = Number(r.getResponse() == question.getCorrect());
                    if (player_profile == null) {
                        let new_player = {"player_id": 0, "user": r.getUser(), "q_submitted": 0, "response_total": 1, "response_correct": correct} as PlayerI;
                        result = await DO.insertPlayer(new_player);
                    }
                    else {
                        player_profile.setResponseTotal(player_profile.getResponseTotal() + 1);
                        if (correct) {
                            player_profile.setResponseCorrect(player_profile.getResponseCorrect() + 1);
                        }
                        result = await DO.updatePlayer(player_profile, result);
                    }
                    // delete the player response
                    result = await DO.deletePlayerAnswer(r.getAnswerID());
                }
                let total = responses.length;
                let ratio = count[question.getCorrect()] / total;

                // build the response embed
                let date = new Date(asked_question!!.getDate());
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let year = date.getFullYear();
                let thumbnail = BCONST.MAXIMUS_IMAGES[asked_question!!.getMaxImg()].url;
                const embed = new EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
                embed.setTitle(`**Question (${month}/${day}/${year})**`);    
                let description: string;
                let second_description: string;
                if (ratio > 0.3) {
                    description = "_" + BCONST.MAXIMUS_PHRASES_END_GOOD[Math.floor(Math.random()*BCONST.MAXIMUS_PHRASES_END_GOOD.length)] + "_\n\n";
                }
                else {
                    description = "_" + BCONST.MAXIMUS_PHRASES_END_BAD[Math.floor(Math.random()*BCONST.MAXIMUS_PHRASES_END_BAD.length)] + "_\n\n";
                }
                second_description = description;
                description += "**" + question!!.getQuestion() + '**\n';
                
                let letter: string;
                let ans: string;
                let count_str: string;
                let correct = false;
                for (let i=0; i < 4; i++) {
                    if (i == 0) {
                        letter = "A";
                        ans = question.getAnswers()[asked_question!!.getAnsA()];
                        correct = (asked_question!!.getAnsA() == question.getCorrect());
                        count_str = `\t\t[${count[asked_question!!.getAnsA()]}/${total}]`;
                    }
                    else if (i == 1) {
                        letter = "B";   
                        ans = question.getAnswers()[asked_question!!.getAnsB()];
                        correct = (asked_question!!.getAnsB() == question.getCorrect());
                        count_str = `\t\t[${count[asked_question!!.getAnsB()]}/${total}]`;
                    }
                    else if (i == 2) {
                        letter = "C";   
                        ans = question.getAnswers()[asked_question!!.getAnsC()];
                        correct = (asked_question!!.getAnsC() == question.getCorrect());
                        count_str = `\t\t[${count[asked_question!!.getAnsC()]}/${total}]`;
                    }
                    else {
                        letter = "D";   
                        ans = question.getAnswers()[asked_question!!.getAnsD()];
                        correct = (asked_question!!.getAnsD() == question.getCorrect());
                        count_str = `\t\t[${count[asked_question!!.getAnsD()]}/${total}]`;
                    }
                    if (correct) {
                        description += `\n**${letter}. ${ans}**`;
                    }
                    else {
                        description += `\n${letter}. ${ans}`;
                    }
                    description += count_str;
                    
                }
                description += `\n\nThe correct answer was \`${question.getAnswers()[question.getCorrect()]}\`!`;
                if (question.getFunFact().length > 2) {
                    description += `\n${question.getFunFact()}`
                }
                
                if (question!!.getImage().length > 3) {
                    embed.setImage(question!!.getImage());
                }

                embed.setDescription(description);
                message.edit({embeds: [embed], components: []});

                console.log("before updates result: ", result);

                // update the asked_question to be disabled, and with the respective responses
                asked_question!!.setActive(0);
                asked_question!!.setResponseTotal(total);
                asked_question!!.setResponseCorrect(count[question.getCorrect()]);
                result = await DO.updateAskedQuestion(asked_question!!, result);
                console.log("First result: ", result);
                // update the question responses
                question.setResponseTotal(question.getResponseTotal() + total);
                question.setResponseCorrect(question.getResponseCorrect() + count[question.getCorrect()]);
                result = await DO.updateQuestion(question, result);

                console.log(`End of the updates. Going to send next question. ${result}`);

                if (!result) {
                    // add an extra ping to notify the users
                    let channel: Channel | undefined = await message.client.channels.cache.get(message.channelId);
                    if (typeof channel === 'undefined') result = GameInteractionErr.GuildDataUnavailable;
                    channel = channel as TextChannel;
                    second_description += `Polling has closed! The correct answer was \`${question.getAnswers()[question.getCorrect()]}\`!`
                    let new_message = await channel!!.send(second_description);
                    // start the next question
                    let duration = Math.random() * 60 * 5 * 1000; //60 * 60 * 23 * 1000; // 23 hours in ms
                    console.log("duration set: ", duration);
                    setTimeout(createNewQuestion, duration, message.guildId, message.channelId, message.client);
                }
            }
        } 
    }

    return result;
}