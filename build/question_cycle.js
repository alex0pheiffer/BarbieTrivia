"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showQuestionResult = void 0;
const discord_js_1 = require("discord.js");
const BCONST_1 = require("./BCONST");
const DOBuilder_1 = require("./data/DOBuilder");
const Errors_1 = require("./Errors");
async function showQuestionResult(message, ask_id) {
    console.log("Enterinig question result.");
    let result = 0;
    // question
    let asked_questions = await DOBuilder_1.DO.getAskedQuestionByAskID(ask_id);
    let asked_question;
    if (asked_questions.length < 1) {
        result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
    }
    else {
        asked_question = asked_questions[0];
    }
    if (!result) {
        let question = await DOBuilder_1.DO.getQuestion(asked_question.getQuestionID());
        if (question == null) {
            result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
        }
        else {
            // collect the responses to this question
            let responses = await DOBuilder_1.DO.getPlayerAnswers(ask_id);
            if (responses.length < 1) {
                result = Errors_1.GameInteractionErr.NoPlayerResponses;
                // if no responses have been recorded, extend the life of this question.
                // TODO
            }
            else {
                let r;
                // these are the REAL VALUES (not the shuffled values)
                let count = [0, 0, 0, 0];
                for (let i = 0; i < responses.length; i++) {
                    r = responses[i];
                    if (r.getSubmtitted()) {
                        count[r.getResponse()]++;
                    }
                }
                let total = responses.length;
                let ratio = count[question.getCorrect()] / total;
                // build the response embed
                let date = new Date(asked_question.getDate());
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let year = date.getFullYear();
                let thumbnail = BCONST_1.BCONST.MAXIMUS_IMAGES[asked_question.getMaxImg()].url;
                const embed = new discord_js_1.EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({ text: 'Barbie Trivia', iconURL: BCONST_1.BCONST.LOGO });
                embed.setTitle(`**Question (${month}/${day}/${year})**`);
                let description;
                if (ratio > 0.3) {
                    description = BCONST_1.BCONST.MAXIMUS_PHRASES_END_GOOD[Math.floor(Math.random() * BCONST_1.BCONST.MAXIMUS_PHRASES_END_GOOD.length)] + "\n\n";
                }
                else {
                    description = BCONST_1.BCONST.MAXIMUS_PHRASES_END_BAD[Math.floor(Math.random() * BCONST_1.BCONST.MAXIMUS_PHRASES_END_BAD.length)] + "\n\n";
                }
                description += question.getQuestion() + '\n';
                let letter;
                let ans;
                let count_str;
                let correct = false;
                for (let i = 0; i < 4; i++) {
                    if (i == 0) {
                        letter = "A";
                        ans = question.getAnswers()[asked_question.getAnsA()];
                        correct = (asked_question.getAnsA() == question.getCorrect());
                        count_str = `\t\t[${count[asked_question.getAnsA()]}/${total}]`;
                    }
                    else if (i == 1) {
                        letter = "B";
                        ans = question.getAnswers()[asked_question.getAnsB()];
                        correct = (asked_question.getAnsB() == question.getCorrect());
                        count_str = `\t\t[${count[asked_question.getAnsB()]}/${total}]`;
                    }
                    else if (i == 2) {
                        letter = "C";
                        ans = question.getAnswers()[asked_question.getAnsC()];
                        correct = (asked_question.getAnsC() == question.getCorrect());
                        count_str = `\t\t[${count[asked_question.getAnsC()]}/${total}]`;
                    }
                    else {
                        letter = "D";
                        ans = question.getAnswers()[asked_question.getAnsD()];
                        correct = (asked_question.getAnsD() == question.getCorrect());
                        count_str = `\t\t[${count[asked_question.getAnsD()]}/${total}]`;
                    }
                    if (correct) {
                        description += `\n**${letter}. ${ans}**`;
                    }
                    else {
                        description += `\n${letter}. ${ans}`;
                    }
                    description += count_str;
                }
                console.log("editing message");
                embed.setDescription(description);
                message.edit({ embeds: [embed] });
                // todo update the sql database
            }
        }
    }
    return result;
}
exports.showQuestionResult = showQuestionResult;
