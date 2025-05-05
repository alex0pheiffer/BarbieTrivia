import { Channel, EmbedBuilder, Message, TextChannel } from "discord.js";
import { BCONST } from "./BCONST";
import { AskedQuestionO } from "./data/data_objects/askedQuesetion";
import { PlayerAnswerO } from "./data/data_objects/playerAnswer";
import { DO } from "./data/DOBuilder";
import { GameInteractionErr } from "./Errors";
import { PlayerI } from "./data/data_interfaces/player";
import { createNewQuestion } from "./new";
import { gameStillActive } from "./end";

export async function showQuestionResult(message: Message, ask_id: number): Promise<Number> {
    console.log("etnering show question result")
    let result = 0;

    // check if the game is still active
    if (!(await gameStillActive(message.channelId, message.client))) {
        result = GameInteractionErr.GameDoesNotExist;
    }

    // question
    let asked_questions = await DO.getAskedQuestionByAskID(ask_id);
    let asked_question: AskedQuestionO;
    let users_correct_list: string[] = [];
    if (asked_questions.length < 1) {
        console.log("asked question doesn't exist")
        result = GameInteractionErr.QuestionDoesNotExist;
    }
    else {
        asked_question = asked_questions[0];
        console.log("asked question =", asked_question)
    }
    if (!result) {
        let question = await DO.getQuestion(asked_question!!.getQuestionID())
        if (question == null) {
            console.log("quesetion does not exist")
            result = GameInteractionErr.QuestionDoesNotExist;
        }
        else {
            // collect the responses to this question
            let responses_raw = await DO.getPlayerAnswers(ask_id);
            // filter responses to only include answers that were _submitted_
            let responses: PlayerAnswerO[] = [];
            responses_raw.forEach((r, i) => {
                if (r.getSubmtitted() > 0) {
                    responses.push(r);
                }
            });
            console.log("responses raw: ", responses_raw);
            console.log("responses: ", responses);
            if (responses.length < 2) {
                let duration = BCONST.TIME_UNTIL_ANSWER;
                setTimeout(showQuestionResult, duration, message, ask_id);
                let channel: Channel | undefined = await message.client.channels.cache.get(message.channelId);
                if (typeof channel === 'undefined') result = GameInteractionErr.GuildDataUnavailable;
                channel = channel as TextChannel;
                let description = "";
                if (responses.length < 1)
                    description = `Because nobody has responded to the trivia question, the question is being extended another 24 hours.`
                else
                    description = `Because only one person has responded to the trivia question, the question is being extended another 24 hours.`
                let new_message = await channel!!.send(description);
                asked_question!!.setShowResultTime(asked_question!!.getShowResultTime() + duration);
                result = await DO.updateAskedQuestion(asked_question!!, result);
            }
            else {
                let r: PlayerAnswerO;
                // these are the REAL VALUES (not the shuffled values)
                let count = [0,0,0,0];
                for (let i=0; i < responses.length; i++) {
                    console.log("looking into response #", i)
                    r = responses[i];
                    if (r.getSubmtitted()) {
                        count[r.getResponse()]++;
                    }

                    // update the player's information
                    // check if this user has a profile. if not, create one.
                    let player_profile = await DO.getPlayer(r.getUser());
                    let correct = Number(r.getResponse() == question.getCorrect());
                    if (correct) {
                        users_correct_list.push(r.getUser());
                    }
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
                let q_ch = await DO.getQuestionChannel(message.channelId);
                console.log(q_ch);
                if (q_ch.length < 1) {
                    result = GameInteractionErr.QuestionChannelDoesNotExist;
                }
                let thumbnail = BCONST.MAXIMUS_IMAGES[asked_question!!.getMaxImg()].url;
                const embed = new EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
                embed.setTitle(`**Question ${(result<1) ? q_ch[0].getQuestionsAsked()+1 : "???"}**`);    
                let description: string;
                let second_description: string;
                if (ratio >= 0.5) {
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

                // update the asked_question to be disabled, and with the respective responses
                asked_question!!.setActive(0);
                asked_question!!.setResponseTotal(total);
                asked_question!!.setResponseCorrect(count[question.getCorrect()]);
                result = await DO.updateAskedQuestion(asked_question!!, result);
                // update the question responses
                question.setResponseTotal(question.getResponseTotal() + total);
                question.setResponseCorrect(question.getResponseCorrect() + count[question.getCorrect()]);
                result = await DO.updateQuestion(question, result);
                // update the question_channel to increment the number of questions asked
                if (q_ch.length > 0) {
                    q_ch[0].setQuestionsAsked(q_ch[0].getQuestionsAsked()+1);
                }
                else {
                    console.log("ERROR: could not update the question channel question count.");
                    result = GameInteractionErr.SQLConnectionError;
                }

                if (!result) {
                    // add an extra ping to notify the users
                    let channel: Channel | undefined = await message.client.channels.cache.get(message.channelId);
                    if (typeof channel === 'undefined') result = GameInteractionErr.GuildDataUnavailable;
                    channel = channel as TextChannel;
                    second_description += `Polling has closed! The correct answer was \`${question.getAnswers()[question.getCorrect()]}\`!`
                    // congrats to those who got it right!
                    if (users_correct_list.length > 0) {
                        second_description += "\nCongrats to "
                        for (let i=0; i < users_correct_list.length; i++) {
                            if (i < users_correct_list.length - 1 && users_correct_list.length > 2) {
                                second_description += `<@${users_correct_list[i]}>, `;
                            }
                            else if (users_correct_list.length < 2) {
                                second_description += `<@${users_correct_list[i]}>!`;
                            }
                            else if (users_correct_list.length < 3 && i < 1) {
                                second_description += `<@${users_correct_list[i]}> `;
                            }
                            else {
                                second_description += `and <@${users_correct_list[i]}>!`;
                            }
                            
                        }
                    }
                    else {
                        second_description += "\nNobody got it right!";
                    }
                    // update the question channel questions asked
                    result = await DO.updateQuestionChannel(q_ch[0], result);

                    let duration = Math.random() * BCONST.TIME_UNTIL_NEXT_QUESTION_MAX;
                    let hrs = Math.floor(duration / 1000 / 60 / 60);
                    // update the asked_question to include this duration
                    const d = new Date();
                    let time = d.getTime();
                    asked_question!!.setNextQuestionTime(time + duration);
                    result = await DO.updateAskedQuestion(asked_question!!, result);

                    if (hrs > 1) {
                        second_description += `\n\nThe next question will appear in ${hrs} hours.`;
                    }
                    else if (hrs > 0) {
                        second_description += `\n\nThe next question will appear in 1 hour.`;
                    }
                    else {
                        second_description += `\n\nThe next question will appear in less than an hour.`;
                    }

                    let new_message = await channel!!.send(second_description);
                    // start the next question

                    setTimeout(createNewQuestion, duration, message.guildId, message.channelId, message.client);
                }
            }
        } 
    }

    return result;
}