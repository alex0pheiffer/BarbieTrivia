"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chooseQuestion = exports.addPrompt = void 0;
const discord_js_1 = require("discord.js");
const BCONST_1 = require("./BCONST");
const proposal_1 = require("./data/data_objects/proposal");
const DOBuilder_1 = require("./data/DOBuilder");
const Errors_1 = require("./Errors");
const question_1 = require("./data/data_objects/question");
// hour time out period
const modal_timeout = 60 * 60 * 1000;
async function addPrompt(interaction) {
    let result = 0;
    // display the new question
    result = await createFirstModal(interaction, -1, null, false);
    return result;
}
exports.addPrompt = addPrompt;
async function createFirstModal(interaction, current_prompt, master_message, isAdminCheck) {
    let result = 0;
    let prompt = null;
    if (current_prompt >= 0) {
        prompt = await DOBuilder_1.DO.getProposal(current_prompt);
        if (prompt == null) {
            result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
        }
    }
    const modal = new discord_js_1.ModalBuilder().setCustomId(`${BCONST_1.BCONST.MODAL_PROMPT}_${interaction.id}`);
    modal.setTitle(`Question Input`);
    const QuestionInput = new discord_js_1.TextInputBuilder()
        .setCustomId(BCONST_1.BCONST.MODAL_QUESTION_INPUT)
        .setLabel("Please enter your question.")
        // Short means only a single line of text
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setMaxLength(500)
        .setMinLength(10)
        .setRequired(true);
    if (current_prompt >= 0 && !result) {
        QuestionInput.setValue(prompt.getQuestion());
    }
    const ImageInput = new discord_js_1.TextInputBuilder()
        .setCustomId(BCONST_1.BCONST.MODAL_IMAGE_INPUT)
        .setLabel("[OPTIONAL] If about an image, enter the url.")
        // Short means only a single line of text
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setPlaceholder("Hint: Send the image in discord and copy the url.")
        .setMaxLength(500)
        .setMinLength(10)
        .setRequired(false);
    if (current_prompt >= 0 && !result && prompt.getImage().length > 3) {
        ImageInput.setValue(prompt.getImage());
    }
    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow = new discord_js_1.ActionRowBuilder().addComponents(QuestionInput);
    const sixthActionRow = new discord_js_1.ActionRowBuilder().addComponents(ImageInput);
    // Add inputs to the modal
    modal.addComponents(firstActionRow, sixthActionRow);
    interaction.showModal(modal);
    try {
        const modal_result = await interaction.awaitModalSubmit({
            filter: async (i) => {
                const filter = i.user.id === interaction.user.id &&
                    i.customId === `${BCONST_1.BCONST.MODAL_PROMPT}_${interaction.id}`;
                if (filter) {
                    if (isAdminCheck) {
                        await i.deferReply({ ephemeral: false });
                        console.log("Defer Reply (1)");
                    }
                    else {
                        await i.deferReply({ ephemeral: true });
                        console.log("Defer Reply (2)");
                    }
                }
                else {
                    console.log(`Did not meet filter requirements. userID: ${interaction.user.id} vs ${i.user.id}, modalID: ${BCONST_1.BCONST.MODAL_PROMPT}_${interaction.id} vs ${i.customId}`);
                }
                return filter;
            },
            time: modal_timeout,
        });
        console.log("Completed Modal Result 1");
        //await modal_result.editReply(modal_result.fields.getTextInputValue(BCONST.MODAL_QUESTION_INPUT));
        // update the prompt information
        let question_input = modal_result.fields.getTextInputValue(BCONST_1.BCONST.MODAL_QUESTION_INPUT);
        console.log("question_input recieved");
        let image_input = modal_result.fields.getTextInputValue(BCONST_1.BCONST.MODAL_IMAGE_INPUT);
        console.log("image_input recieved");
        if (prompt != null) {
            prompt.setQuestion(question_input);
            if (image_input.length > 3) {
                prompt.setImage(image_input);
            }
            result = await DOBuilder_1.DO.updateProposal(prompt, result);
        }
        else {
            let prompt_interface = { "proposal_id": 0,
                "question": question_input,
                "image": image_input,
                "ans_a": "",
                "ans_b": "",
                "ans_c": "",
                "ans_d": "",
                "d_always_last": 0,
                "fun_fact": "",
                "correct": 0,
                "date": 0,
                "submitter": interaction.user.id,
                "submitted": 0 };
            prompt = new proposal_1.ProposalO(prompt_interface);
            result = await DOBuilder_1.DO.insertProposal(prompt);
            prompt = await DOBuilder_1.DO.getProposalByQuestion(question_input);
            if (prompt == null) {
                result = Errors_1.GameInteractionErr.SQLConnectionError;
            }
        }
        // send the current version of the question for viewing
        if (!result) {
            if (isAdminCheck) {
                console.log("entering modal_result (1)");
                result = await adminCheckEmbed(modal_result, modal_result.client, prompt, false);
            }
            else {
                console.log("entering modal_result (2)");
                result = await createEmbedResult(modal_result, prompt, master_message);
            }
        }
    }
    catch (e) {
        // do nothing
        console.log(e);
        console.log("Modal Timed Out");
    }
    return result;
}
async function createSecondModal(interaction, current_prompt, master_message, isAdminCheck) {
    let result = 0;
    let prompt = null;
    if (current_prompt >= 0) {
        prompt = await DOBuilder_1.DO.getProposal(current_prompt);
        if (prompt == null) {
            result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
        }
    }
    const modal2 = new discord_js_1.ModalBuilder().setCustomId(`${BCONST_1.BCONST.MODAL_PROMPT2}_${interaction.id}`);
    modal2.setTitle(`Answer Inputs`);
    const AnsAInput = new discord_js_1.TextInputBuilder()
        .setCustomId("Answer A Input")
        .setLabel("Answer option A.")
        // Short means only a single line of text
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setMaxLength(200)
        .setMinLength(1)
        .setRequired(true);
    if (current_prompt >= 0 && !result && prompt.getAnswers()[0].length > 0) {
        AnsAInput.setValue(prompt.getAnswers()[0]);
    }
    const AnsBInput = new discord_js_1.TextInputBuilder()
        .setCustomId(BCONST_1.BCONST.MODAL_ANS_B_INPUT)
        .setLabel("Answer option B.")
        // Short means only a single line of text
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setMaxLength(200)
        .setMinLength(1)
        .setRequired(true);
    if (current_prompt >= 0 && !result && prompt.getAnswers()[1].length > 0) {
        AnsBInput.setValue(prompt.getAnswers()[1]);
    }
    const AnsCInput = new discord_js_1.TextInputBuilder()
        .setCustomId(BCONST_1.BCONST.MODAL_ANS_C_INPUT)
        .setLabel("Answer option C.")
        // Short means only a single line of text
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setMaxLength(200)
        .setMinLength(1)
        .setRequired(true);
    if (current_prompt >= 0 && !result && prompt.getAnswers()[2].length > 0) {
        AnsCInput.setValue(prompt.getAnswers()[2]);
    }
    const AnsDInput = new discord_js_1.TextInputBuilder()
        .setCustomId(BCONST_1.BCONST.MODAL_ANS_D_INPUT)
        .setLabel("Answer option D.")
        // Short means only a single line of text
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setMaxLength(200)
        .setMinLength(1)
        .setRequired(true);
    if (current_prompt >= 0 && !result && prompt.getAnswers()[3].length > 0) {
        AnsDInput.setValue(prompt.getAnswers()[3]);
    }
    // An action row only holds one text input,
    // so you need one action row per text input.
    const secondActionRow = new discord_js_1.ActionRowBuilder().addComponents(AnsAInput);
    const thirdActionRow = new discord_js_1.ActionRowBuilder().addComponents(AnsBInput);
    const fourthActionRow = new discord_js_1.ActionRowBuilder().addComponents(AnsCInput);
    const fifthActionRow = new discord_js_1.ActionRowBuilder().addComponents(AnsDInput);
    modal2.addComponents(secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);
    interaction.showModal(modal2);
    try {
        const modal_result2 = await interaction.awaitModalSubmit({
            filter: async (i) => {
                const filter = i.user.id === interaction.user.id &&
                    i.customId === `${BCONST_1.BCONST.MODAL_PROMPT2}_${interaction.id}`;
                if (filter) {
                    if (isAdminCheck) {
                        await i.deferReply({ ephemeral: false });
                        console.log("Defer Reply (3)");
                    }
                    else {
                        await i.deferReply({ ephemeral: true });
                        console.log("Defer Reply (4)");
                    }
                }
                else {
                    console.log(`Did not meet filter requirements. userID: ${interaction.user.id} vs ${i.user.id}, modalID: ${BCONST_1.BCONST.MODAL_PROMPT2}_${interaction.id} vs ${i.customId}`);
                }
                return filter;
            },
            time: modal_timeout,
        });
        console.log("Completed Modal Result 2");
        let ansA_input = modal_result2.fields.getTextInputValue(BCONST_1.BCONST.MODAL_ANS_A_INPUT);
        console.log("ansA_input recieved");
        let ansB_input = modal_result2.fields.getTextInputValue(BCONST_1.BCONST.MODAL_ANS_B_INPUT);
        console.log("ansB_input recieved");
        let ansC_input = modal_result2.fields.getTextInputValue(BCONST_1.BCONST.MODAL_ANS_C_INPUT);
        console.log("ansC_input recieved");
        let ansD_input = modal_result2.fields.getTextInputValue(BCONST_1.BCONST.MODAL_ANS_D_INPUT);
        console.log("ansD_input recieved");
        if (prompt != null) {
            prompt.setAnsA(ansA_input);
            prompt.setAnsB(ansB_input);
            prompt.setAnsC(ansC_input);
            prompt.setAnsD(ansD_input);
            result = await DOBuilder_1.DO.updateProposal(prompt, result);
        }
        else {
            result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
        }
        // send the current version of the question for viewing
        if (!result) {
            if (isAdminCheck) {
                console.log("entering result (3)");
                result = await adminCheckEmbed(modal_result2, modal_result2.client, prompt, false);
            }
            else {
                console.log("entering result (4");
                result = await createEmbedResult(modal_result2, prompt, master_message);
            }
        }
    }
    catch (e) {
        // do nothing
        console.log(e);
        console.log("Modal Timed Out 2");
    }
    return result;
}
async function createThirdModal(interaction, current_prompt, master_message, isAdminCheck) {
    let result = 0;
    let prompt = null;
    if (current_prompt >= 0) {
        prompt = await DOBuilder_1.DO.getProposal(current_prompt);
        if (prompt == null) {
            result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
        }
    }
    const modal3 = new discord_js_1.ModalBuilder().setCustomId(`${BCONST_1.BCONST.MODAL_PROMPT3}_${interaction.id}`);
    modal3.setTitle(`Fun Fact Input`);
    const FunFactInput = new discord_js_1.TextInputBuilder()
        .setCustomId(BCONST_1.BCONST.MODAL_FUNFACT_INPUT)
        .setLabel("Answer's Fun Fact")
        // Short means only a single line of text
        .setStyle(discord_js_1.TextInputStyle.Paragraph)
        .setMaxLength(500)
        .setMinLength(10)
        .setRequired(false);
    if (current_prompt >= 0 && !result && prompt.getFunFact().length > 0) {
        FunFactInput.setValue(prompt.getFunFact());
    }
    const seventhActionRow = new discord_js_1.ActionRowBuilder().addComponents(FunFactInput);
    modal3.addComponents(seventhActionRow);
    interaction.showModal(modal3);
    try {
        const modal_result3 = await interaction.awaitModalSubmit({
            filter: async (i) => {
                const filter = i.user.id === interaction.user.id &&
                    i.customId === `${BCONST_1.BCONST.MODAL_PROMPT3}_${interaction.id}`;
                if (filter) {
                    if (isAdminCheck) {
                        await i.deferReply({ ephemeral: false });
                        console.log("Defer Reply (5)");
                    }
                    else {
                        await i.deferReply({ ephemeral: true });
                        console.log("Defer Reply (6)");
                    }
                }
                else {
                    console.log(`Did not meet filter requirements. userID: ${interaction.user.id} vs ${i.user.id}, modalID: ${BCONST_1.BCONST.MODAL_PROMPT3}_${interaction.id} vs ${i.customId}`);
                }
                return filter;
            },
            time: modal_timeout,
        });
        console.log("Completed Modal Result 3");
        let funfact_input = modal_result3.fields.getTextInputValue(BCONST_1.BCONST.MODAL_FUNFACT_INPUT);
        console.log("funfact_input recieved");
        if (prompt != null) {
            prompt.setFunFact(funfact_input);
            result = await DOBuilder_1.DO.updateProposal(prompt, result);
        }
        else {
            result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
        }
        // send the current version of the question for viewing
        if (!result) {
            if (isAdminCheck) {
                console.log("entering modal_result (5)");
                result = await adminCheckEmbed(modal_result3, modal_result3.client, prompt, false);
            }
            else {
                console.log("entering modal_result (6)");
                result = await createEmbedResult(modal_result3, prompt, master_message);
            }
        }
    }
    catch (e) {
        // do nothing
        console.log(e);
        console.log("Modal Timed Out 3");
    }
    return result;
}
async function createEmbedResult(interaction, prompt, master_message) {
    let result = 0;
    let answer_sent = false;
    let funfact_sent = false;
    const embed = new discord_js_1.EmbedBuilder().setFooter({ text: 'Barbie Trivia', iconURL: BCONST_1.BCONST.LOGO });
    embed.setTitle(`**Submit New Question**`);
    let description = "_Your question so far:_\n\n";
    description += `**${prompt.getQuestion()}**`;
    if (prompt.getImage().length > 3) {
        embed.setImage(prompt.getImage());
    }
    if (prompt.getAnswers()[0].length > 0) {
        answer_sent = true;
        let letter;
        for (let i = 0; i < 4; i++) {
            if (i == 0)
                letter = "A";
            else if (i == 1)
                letter = "B";
            else if (i == 2)
                letter = "C";
            else
                letter = "D";
            if (i == prompt.getCorrect()) {
                description += `\n**${letter}. ${prompt.getAnswers()[i]}**`;
            }
            else {
                description += `\n${letter}. ${prompt.getAnswers()[i]}`;
            }
        }
        description += `\n\nThe correct answer is \`${prompt.getAnswers()[prompt.getCorrect()]}\`.`;
    }
    if (prompt.getFunFact().length > 2) {
        description += "\n" + prompt.getFunFact();
        funfact_sent = true;
    }
    if (prompt.getDAlwaysLast()) {
        description += "\n" + "Answer D is always last.";
    }
    else {
        description += "\n" + "Answer order does not matter.";
    }
    embed.setDescription(description);
    let ans_title;
    let ans_style;
    let funfact_title;
    let funfact_style;
    let submit_style;
    let itemsDropDown_abcd = Array();
    let itemsDropDown_d_always_last = Array();
    if (answer_sent) {
        ans_title = "Edit Answers";
        ans_style = discord_js_1.ButtonStyle.Secondary;
        submit_style = discord_js_1.ButtonStyle.Primary;
        itemsDropDown_abcd.push({ "description": `A. ${prompt.getAnswers()[0]}`, "label": "A", "value": "0" });
        itemsDropDown_abcd.push({ "description": `B. ${prompt.getAnswers()[1]}`, "label": "B", "value": "1" });
        itemsDropDown_abcd.push({ "description": `C. ${prompt.getAnswers()[2]}`, "label": "C", "value": "2" });
        itemsDropDown_abcd.push({ "description": `D. ${prompt.getAnswers()[3]}`, "label": "D", "value": "3" });
    }
    else {
        ans_title = "Add Answers";
        ans_style = discord_js_1.ButtonStyle.Primary;
        submit_style = discord_js_1.ButtonStyle.Secondary;
        itemsDropDown_abcd.push({ "description": "Option A.", "label": "A", "value": "0" });
        itemsDropDown_abcd.push({ "description": "Option B.", "label": "B", "value": "1" });
        itemsDropDown_abcd.push({ "description": "Option C.", "label": "C", "value": "2" });
        itemsDropDown_abcd.push({ "description": "Option D.", "label": "D", "value": "3" });
    }
    if (funfact_sent) {
        funfact_title = "Edit Fun Fact";
        funfact_style = discord_js_1.ButtonStyle.Secondary;
    }
    else {
        funfact_title = "Add Fun Fact";
        funfact_style = discord_js_1.ButtonStyle.Primary;
    }
    itemsDropDown_d_always_last.push({ "description": `None of the answer choice order matters.`, "label": "Any Order", "value": "0" });
    itemsDropDown_d_always_last.push({ "description": `Answer D should always be last.`, "label": "D Last", "value": "1" });
    const btn_question = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId(BCONST_1.BCONST.BTN_QUESTION).setLabel("Edit Question").setStyle(discord_js_1.ButtonStyle.Secondary));
    const btns_answer = btn_question.addComponents(new discord_js_1.ButtonBuilder().setCustomId(BCONST_1.BCONST.BTN_ANSWER).setLabel(ans_title).setStyle(ans_style));
    const btns_funfact = btns_answer.addComponents(new discord_js_1.ButtonBuilder().setCustomId(BCONST_1.BCONST.BTN_FUNFACT).setLabel(funfact_title).setStyle(funfact_style));
    const btns_submit = btns_funfact.addComponents(new discord_js_1.ButtonBuilder().setCustomId(BCONST_1.BCONST.BTN_PROPOSAL_SUBMIT).setLabel("Submit").setStyle(submit_style));
    // create in-between button
    const dropdown_ABCD = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder().setCustomId(BCONST_1.BCONST.DROPDOWN_ABCD).setPlaceholder('Select the correct answer:').addOptions(itemsDropDown_abcd));
    const dropdown_D_Last = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder().setCustomId(BCONST_1.BCONST.DROPDOWN_DLAST).setPlaceholder('Should option D always be last?').addOptions(itemsDropDown_d_always_last));
    let message;
    // master_message was intended to allow for me to edit the ephemeral message.
    // alas, it isn't working so i am going to move on
    if (true) {
        message = await interaction.editReply({ embeds: [embed], components: [btns_submit, dropdown_ABCD, dropdown_D_Last] });
        master_message = message;
    }
    else {
        message = await master_message.update({ embeds: [embed], components: [btns_submit, dropdown_ABCD] });
    }
    const filter_btn = (inter) => (inter.customId === BCONST_1.BCONST.BTN_QUESTION || inter.customId === BCONST_1.BCONST.BTN_ANSWER || inter.customId === BCONST_1.BCONST.BTN_FUNFACT || inter.customId === BCONST_1.BCONST.BTN_PROPOSAL_SUBMIT);
    const filter_dropdown = (inter) => inter.customId === BCONST_1.BCONST.DROPDOWN_ABCD;
    const filter_dropdown_d = (inter) => inter.customId === BCONST_1.BCONST.DROPDOWN_DLAST;
    const btn_collector = message.createMessageComponentCollector({ filter: filter_btn, componentType: discord_js_1.ComponentType.Button });
    const collector_drop = message.createMessageComponentCollector({ filter: filter_dropdown });
    const collector_drop_d = message.createMessageComponentCollector({ filter: filter_dropdown_d });
    btn_collector.on('collect', async (inter) => {
        if (prompt.getProposalID() == null) {
            result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
        }
        else {
            buttonResponse(inter, prompt.getProposalID(), master_message, false).then(async (err) => {
                let resp = "";
                switch (err) {
                    case 0:
                        break;
                    case Errors_1.GameInteractionErr.QuestionDoesNotExist:
                        resp = "The proposal did not get formed correctly.";
                        break;
                    case Errors_1.GameInteractionErr.NoAnswerSelected:
                    case Errors_1.GameInteractionErr.QuestionExpired:
                    case Errors_1.GameInteractionErr.GuildDataUnavailable:
                    case Errors_1.GameInteractionErr.SQLConnectionError:
                    default:
                        resp = "Something went wrong.";
                }
                // respond to the interaction
                if (resp.length > 0) {
                    inter.editReply(resp);
                }
            });
        }
    });
    btn_collector.on('end', (collected) => {
        // nothing 
    });
    collector_drop.on('collect', async (inter) => {
        await inter.deferUpdate();
        let proposal_id = prompt.getProposalID();
        let result = 0;
        // get the current proposal
        let prompt_new = null;
        if (proposal_id >= 0) {
            prompt_new = await DOBuilder_1.DO.getProposal(proposal_id);
            if (prompt == null) {
                result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
            }
        }
        if (!result) {
            prompt_new.setCorrect(Number(inter.values[0]));
            result = await DOBuilder_1.DO.updateProposal(prompt_new, result);
            // update the description
            // this is poor programming but im tired
            const embed = new discord_js_1.EmbedBuilder().setFooter({ text: 'Barbie Trivia', iconURL: BCONST_1.BCONST.LOGO });
            embed.setTitle(`**Submit New Question**`);
            let description = "_Your question so far:_\n\n";
            description += `**${prompt_new.getQuestion()}**`;
            if (prompt_new.getImage().length > 3) {
                embed.setImage(prompt_new.getImage());
            }
            if (prompt_new.getAnswers()[0].length > 0) {
                answer_sent = true;
                let letter;
                for (let i = 0; i < 4; i++) {
                    if (i == 0)
                        letter = "A";
                    else if (i == 1)
                        letter = "B";
                    else if (i == 2)
                        letter = "C";
                    else
                        letter = "D";
                    if (i == prompt_new.getCorrect()) {
                        description += `\n**${letter}. ${prompt_new.getAnswers()[i]}**`;
                    }
                    else {
                        description += `\n${letter}. ${prompt_new.getAnswers()[i]}`;
                    }
                }
                description += `\n\nThe correct answer is \`${prompt_new.getAnswers()[prompt_new.getCorrect()]}\`.`;
            }
            if (prompt_new.getFunFact().length > 2) {
                description += "\n" + prompt_new.getFunFact();
                funfact_sent = true;
            }
            if (prompt_new.getDAlwaysLast()) {
                description += "\n" + "Answer D is always last.";
            }
            else {
                description += "\n" + "Answer order does not matter.";
            }
            embed.setDescription(description);
            inter.editReply({ embeds: [embed], components: [btns_submit, dropdown_ABCD, dropdown_D_Last] });
        }
    });
    collector_drop.on('end', (collected) => {
        // nothing
    });
    collector_drop_d.on('collect', async (inter) => {
        await inter.deferUpdate();
        let proposal_id = prompt.getProposalID();
        let result = 0;
        // get the current proposal
        let prompt_new = null;
        if (proposal_id >= 0) {
            prompt_new = await DOBuilder_1.DO.getProposal(proposal_id);
            if (prompt == null) {
                result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
            }
        }
        if (!result) {
            prompt_new.setDAlwaysLast(Boolean(Number(inter.values[0])));
            result = await DOBuilder_1.DO.updateProposal(prompt_new, result);
            // update the description
            // this is poor programming but im tired
            const embed = new discord_js_1.EmbedBuilder().setFooter({ text: 'Barbie Trivia', iconURL: BCONST_1.BCONST.LOGO });
            embed.setTitle(`**Submit New Question**`);
            let description = "_Your question so far:_\n\n";
            description += `**${prompt_new.getQuestion()}**`;
            if (prompt_new.getImage().length > 3) {
                embed.setImage(prompt_new.getImage());
            }
            if (prompt_new.getAnswers()[0].length > 0) {
                answer_sent = true;
                let letter;
                for (let i = 0; i < 4; i++) {
                    if (i == 0)
                        letter = "A";
                    else if (i == 1)
                        letter = "B";
                    else if (i == 2)
                        letter = "C";
                    else
                        letter = "D";
                    if (i == prompt_new.getCorrect()) {
                        description += `\n**${letter}. ${prompt_new.getAnswers()[i]}**`;
                    }
                    else {
                        description += `\n${letter}. ${prompt_new.getAnswers()[i]}`;
                    }
                }
                description += `\n\nThe correct answer is \`${prompt_new.getAnswers()[prompt_new.getCorrect()]}\`.`;
            }
            if (prompt_new.getFunFact().length > 2) {
                description += "\n" + prompt_new.getFunFact();
                funfact_sent = true;
            }
            if (prompt_new.getDAlwaysLast()) {
                description += "\n" + "Answer D is always last.";
            }
            else {
                description += "\n" + "Answer order does not matter.";
            }
            embed.setDescription(description);
            inter.editReply({ embeds: [embed], components: [btns_submit, dropdown_ABCD, dropdown_D_Last] });
        }
    });
    return result;
}
async function buttonResponse(interaction, proposal_id, master_message, isAdminCheck) {
    let result = 0;
    // get the current proposal
    let prompt = null;
    if (proposal_id >= 0) {
        prompt = await DOBuilder_1.DO.getProposal(proposal_id);
        if (prompt == null) {
            result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
        }
    }
    if (!result) {
        switch (interaction.customId) {
            case BCONST_1.BCONST.BTN_QUESTION:
                result = await createFirstModal(interaction, proposal_id, master_message, isAdminCheck);
                break;
            case BCONST_1.BCONST.BTN_ANSWER:
                result = await createSecondModal(interaction, proposal_id, master_message, isAdminCheck);
                break;
            case BCONST_1.BCONST.BTN_FUNFACT:
                result = await createThirdModal(interaction, proposal_id, master_message, isAdminCheck);
                break;
            case BCONST_1.BCONST.BTN_PROPOSAL_SUBMIT:
                if (prompt.getAnswers()[0].length > 0 &&
                    prompt.getAnswers()[1].length > 0 &&
                    prompt.getAnswers()[2].length > 0 &&
                    prompt.getAnswers()[3].length > 0 &&
                    prompt.getQuestion().length > 0) {
                    // submit the current prompt
                    prompt.setSubmitted(1);
                    const d = new Date();
                    let time = d.getTime();
                    prompt.setDate(time);
                    result = await DOBuilder_1.DO.updateProposal(prompt, result);
                    // check if the user is an admin;
                    // if theyre not, add it to the Elevator channel
                    let isAdmin = await DOBuilder_1.DO.getAdmin(interaction.user.id);
                    if (isAdmin == null) {
                        interaction.reply({ ephemeral: true, content: "Your question has been submitted. Because you are not an admin, it is awaiting approval." });
                        // send message to the elevator
                        result = await chooseQuestion(interaction.client, proposal_id);
                    }
                    else {
                        let question_interface = prompt.getQuestionI();
                        let question_object = new question_1.QuestionO(question_interface);
                        result = await DOBuilder_1.DO.insertQuestion(question_object);
                        result = await DOBuilder_1.DO.deleteProposal(prompt.getProposalID());
                        interaction.reply({ ephemeral: true, content: "Your question has been submitted. Because you are an admin, it has been automatically accepted. Congrats." });
                        // update the user's profile
                        let user_profile = await DOBuilder_1.DO.getPlayer(interaction.user.id);
                        if (user_profile != null) {
                            user_profile.setQSubmitted(user_profile.getQSubmitted() + 1);
                            console.log("user profile q submitted: ", user_profile.getQSubmitted());
                            result = await DOBuilder_1.DO.updatePlayer(user_profile, result);
                            console.log("questioni submitted increment update:", result);
                        }
                        else {
                            let new_player = { "player_id": 0, "user": interaction.user.id, "q_submitted": 1, "response_total": 0, "response_correct": 0 };
                            result = await DOBuilder_1.DO.insertPlayer(new_player);
                            console.log("User profile was null; made a new profile");
                        }
                    }
                    // inform the group that a new question was submitted
                    // get the trivia channel
                    if (interaction.guildId) {
                        let quest_channel = await DOBuilder_1.DO.getQuestionChannelByServer(interaction.guildId);
                        if (quest_channel.length > 0) {
                            let channel = await interaction.client.channels.cache.get(quest_channel[0].getChannel());
                            if (typeof channel === 'undefined')
                                result = Errors_1.GameInteractionErr.GuildDataUnavailable;
                            channel = channel;
                            let new_message = await channel.send("A new question was submitted to the database!");
                        }
                    }
                }
                else {
                    // you cannot submit the current prompt
                    interaction.reply({ ephemeral: true, content: "You cannot submit this question until you have a question and answers." });
                }
                break;
            case BCONST_1.BCONST.BTN_PROPOSAL_ACCEPT:
                interaction.reply({ content: `${interaction.user.username} has chosen to accept this question. It has been added to the pool.` });
                // add as an official question
                let question_interface = prompt.getQuestionI();
                let question_object = new question_1.QuestionO(question_interface);
                result = await DOBuilder_1.DO.insertQuestion(question_object);
                // delete the prompt
                result = await DOBuilder_1.DO.deleteProposal(prompt.getProposalID());
                // update the user's profile
                let user_profile = await DOBuilder_1.DO.getPlayer(prompt.getSubmitter());
                if (user_profile != null) {
                    user_profile.setQSubmitted(user_profile.getQSubmitted() + 1);
                    result = await DOBuilder_1.DO.updatePlayer(user_profile, result);
                }
                else {
                    let new_player = { "player_id": 0, "user": interaction.user.id, "q_submitted": 1, "response_total": 0, "response_correct": 0 };
                    result = await DOBuilder_1.DO.insertPlayer(new_player);
                }
                break;
            case BCONST_1.BCONST.BTN_PROPOSAL_DECLINE:
                interaction.reply({ content: `${interaction.user.username} has chosen to decline this question. It has been deleted.` });
                // delete the prompt
                result = await DOBuilder_1.DO.deleteProposal(prompt.getProposalID());
                break;
            default:
                result = Errors_1.GameInteractionErr.GuildDataUnavailable;
        }
    }
    return result;
}
async function chooseQuestion(client, proposal_id) {
    let result = 0;
    // get the current proposal
    let prompt = null;
    if (proposal_id >= 0) {
        prompt = await DOBuilder_1.DO.getProposal(proposal_id);
        if (prompt == null) {
            result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
        }
    }
    if (!result) {
        result = await adminCheckEmbed(null, client, prompt, true);
    }
    return 0;
}
exports.chooseQuestion = chooseQuestion;
async function adminCheckEmbed(interaction, client, prompt, isFirstPass) {
    let result = 0;
    let answer_sent = false;
    let funfact_sent = false;
    const embed = new discord_js_1.EmbedBuilder().setFooter({ text: 'Barbie Trivia', iconURL: BCONST_1.BCONST.LOGO });
    embed.setTitle(`**Newly Submitted Question**`);
    let user = await client.users.fetch(prompt.getSubmitter());
    let description = `_Proposed Question by ${user.username}:_\n\n`;
    description += `**${prompt.getQuestion()}**`;
    if (prompt.getImage().length > 3) {
        embed.setImage(prompt.getImage());
    }
    if (prompt.getAnswers()[0].length > 0) {
        answer_sent = true;
        let letter;
        for (let i = 0; i < 4; i++) {
            if (i == 0)
                letter = "A";
            else if (i == 1)
                letter = "B";
            else if (i == 2)
                letter = "C";
            else
                letter = "D";
            if (i == prompt.getCorrect()) {
                description += `\n**${letter}. ${prompt.getAnswers()[i]}**`;
            }
            else {
                description += `\n${letter}. ${prompt.getAnswers()[i]}`;
            }
        }
        description += `\n\nThe correct answer is \`${prompt.getAnswers()[prompt.getCorrect()]}\`.`;
    }
    if (prompt.getFunFact().length > 2) {
        description += "\n" + prompt.getFunFact();
        funfact_sent = true;
    }
    if (prompt.getDAlwaysLast()) {
        description += "\n" + "Answer D is always last.";
    }
    else {
        description += "\n" + "Answer order does not matter.";
    }
    embed.setDescription(description);
    let ans_title;
    let ans_style;
    let funfact_title;
    let funfact_style;
    let submit_style;
    let itemsDropDown_abcd = Array();
    let itemsDropDown_d_always_last = Array();
    if (answer_sent) {
        ans_title = "Edit Answers";
        ans_style = discord_js_1.ButtonStyle.Secondary;
        submit_style = discord_js_1.ButtonStyle.Primary;
        itemsDropDown_abcd.push({ "description": `A. ${prompt.getAnswers()[0]}`, "label": "A", "value": "0" });
        itemsDropDown_abcd.push({ "description": `B. ${prompt.getAnswers()[1]}`, "label": "B", "value": "1" });
        itemsDropDown_abcd.push({ "description": `C. ${prompt.getAnswers()[2]}`, "label": "C", "value": "2" });
        itemsDropDown_abcd.push({ "description": `D. ${prompt.getAnswers()[3]}`, "label": "D", "value": "3" });
    }
    else {
        ans_title = "Add Answers";
        ans_style = discord_js_1.ButtonStyle.Primary;
        submit_style = discord_js_1.ButtonStyle.Secondary;
        itemsDropDown_abcd.push({ "description": "Option A.", "label": "A", "value": "0" });
        itemsDropDown_abcd.push({ "description": "Option B.", "label": "B", "value": "1" });
        itemsDropDown_abcd.push({ "description": "Option C.", "label": "C", "value": "2" });
        itemsDropDown_abcd.push({ "description": "Option D.", "label": "D", "value": "3" });
    }
    if (funfact_sent) {
        funfact_title = "Edit Fun Fact";
        funfact_style = discord_js_1.ButtonStyle.Secondary;
    }
    else {
        funfact_title = "Add Fun Fact";
        funfact_style = discord_js_1.ButtonStyle.Primary;
    }
    itemsDropDown_d_always_last.push({ "description": `None of the answer choice order matters.`, "label": "Any Order", "value": "0" });
    itemsDropDown_d_always_last.push({ "description": `Answer D should always be last.`, "label": "D Last", "value": "1" });
    const btn_question = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId(BCONST_1.BCONST.BTN_QUESTION).setLabel("Edit Question").setStyle(discord_js_1.ButtonStyle.Secondary));
    const btns_answer = btn_question.addComponents(new discord_js_1.ButtonBuilder().setCustomId(BCONST_1.BCONST.BTN_ANSWER).setLabel(ans_title).setStyle(ans_style));
    const btns_funfact = btns_answer.addComponents(new discord_js_1.ButtonBuilder().setCustomId(BCONST_1.BCONST.BTN_FUNFACT).setLabel(funfact_title).setStyle(funfact_style));
    const btns_submit = btns_funfact.addComponents(new discord_js_1.ButtonBuilder().setCustomId(BCONST_1.BCONST.BTN_PROPOSAL_ACCEPT).setLabel("Accept").setStyle(submit_style));
    const btns_deny = btns_submit.addComponents(new discord_js_1.ButtonBuilder().setCustomId(BCONST_1.BCONST.BTN_PROPOSAL_DECLINE).setLabel("Decline").setStyle(discord_js_1.ButtonStyle.Danger));
    // create in-between button
    const dropdown_ABCD = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder().setCustomId(BCONST_1.BCONST.DROPDOWN_ABCD).setPlaceholder('Select the correct answer:').addOptions(itemsDropDown_abcd));
    const dropdown_D_Last = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder().setCustomId(BCONST_1.BCONST.DROPDOWN_DLAST).setPlaceholder('Should option D always be last?').addOptions(itemsDropDown_d_always_last));
    let channel = await client.channels.cache.get(BCONST_1.BCONST.MASTER_PROMPT_CHANNEL);
    if (typeof channel === 'undefined')
        result = Errors_1.GameInteractionErr.GuildDataUnavailable;
    channel = channel;
    let message;
    if (isFirstPass) {
        message = await channel.send({ embeds: [embed], components: [dropdown_ABCD, dropdown_D_Last, btns_deny] });
    }
    else if (interaction != null) {
        message = await interaction.editReply({ embeds: [embed], components: [dropdown_ABCD, dropdown_D_Last, btns_deny] });
    }
    const filter_btn = (inter) => (inter.customId === BCONST_1.BCONST.BTN_QUESTION || inter.customId === BCONST_1.BCONST.BTN_ANSWER || inter.customId === BCONST_1.BCONST.BTN_FUNFACT || inter.customId === BCONST_1.BCONST.BTN_PROPOSAL_ACCEPT || inter.customId === BCONST_1.BCONST.BTN_PROPOSAL_DECLINE);
    const filter_dropdown = (inter) => inter.customId === BCONST_1.BCONST.DROPDOWN_ABCD;
    const filter_dropdown_d = (inter) => inter.customId === BCONST_1.BCONST.DROPDOWN_DLAST;
    const btn_collector = message.createMessageComponentCollector({ filter: filter_btn, componentType: discord_js_1.ComponentType.Button });
    const collector_drop = message.createMessageComponentCollector({ filter: filter_dropdown });
    const collector_drop_d = message.createMessageComponentCollector({ filter: filter_dropdown_d });
    btn_collector.on('collect', async (inter) => {
        if (prompt.getProposalID() == null) {
            result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
        }
        else {
            buttonResponse(inter, prompt.getProposalID(), message, true).then(async (err) => {
                let resp = "";
                switch (err) {
                    case 0:
                        break;
                    case Errors_1.GameInteractionErr.QuestionDoesNotExist:
                        resp = "The proposal has ended.";
                        break;
                    case Errors_1.GameInteractionErr.NoAnswerSelected:
                    case Errors_1.GameInteractionErr.QuestionExpired:
                    case Errors_1.GameInteractionErr.GuildDataUnavailable:
                    case Errors_1.GameInteractionErr.SQLConnectionError:
                    default:
                        resp = "Something went wrong.";
                }
                // respond to the interaction
                if (resp.length > 0) {
                    inter.reply(resp);
                }
            });
        }
    });
    btn_collector.on('end', (collected) => {
        // nothing 
    });
    collector_drop.on('collect', async (inter) => {
        await inter.deferUpdate();
        let proposal_id = prompt.getProposalID();
        let result = 0;
        // get the current proposal
        let prompt_new = null;
        if (proposal_id >= 0) {
            prompt_new = await DOBuilder_1.DO.getProposal(proposal_id);
            if (prompt == null) {
                result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
            }
        }
        if (!result) {
            prompt_new.setCorrect(Number(inter.values[0]));
            result = await DOBuilder_1.DO.updateProposal(prompt_new, result);
            // update the description
            // this is poor programming but im tired
            const embed = new discord_js_1.EmbedBuilder().setFooter({ text: 'Barbie Trivia', iconURL: BCONST_1.BCONST.LOGO });
            embed.setTitle(`**Newly Submitted Question**`);
            let user = await client.users.fetch(prompt.getSubmitter());
            let description = `_Proposed Question by ${user.username}:_\n\n`;
            description += `**${prompt.getQuestion()}**`;
            if (prompt_new.getImage().length > 3) {
                embed.setImage(prompt_new.getImage());
            }
            if (prompt_new.getAnswers()[0].length > 0) {
                answer_sent = true;
                let letter;
                for (let i = 0; i < 4; i++) {
                    if (i == 0)
                        letter = "A";
                    else if (i == 1)
                        letter = "B";
                    else if (i == 2)
                        letter = "C";
                    else
                        letter = "D";
                    if (i == prompt_new.getCorrect()) {
                        description += `\n**${letter}. ${prompt_new.getAnswers()[i]}**`;
                    }
                    else {
                        description += `\n${letter}. ${prompt_new.getAnswers()[i]}`;
                    }
                }
                description += `\n\nThe correct answer is \`${prompt_new.getAnswers()[prompt_new.getCorrect()]}\`.`;
            }
            if (prompt_new.getFunFact().length > 2) {
                description += "\n" + prompt_new.getFunFact();
                funfact_sent = true;
            }
            if (prompt_new.getDAlwaysLast()) {
                description += "\n" + "Answer D is always last.";
            }
            else {
                description += "\n" + "Answer order does not matter.";
            }
            embed.setDescription(description);
            inter.editReply({ embeds: [embed], components: [dropdown_ABCD, dropdown_D_Last, btns_deny] });
        }
    });
    collector_drop.on('end', (collected) => {
        // nothing
    });
    collector_drop_d.on('collect', async (inter) => {
        await inter.deferUpdate();
        let proposal_id = prompt.getProposalID();
        let result = 0;
        // get the current proposal
        let prompt_new = null;
        if (proposal_id >= 0) {
            prompt_new = await DOBuilder_1.DO.getProposal(proposal_id);
            if (prompt == null) {
                result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
            }
        }
        if (!result) {
            prompt_new.setDAlwaysLast(Boolean(Number(inter.values[0])));
            result = await DOBuilder_1.DO.updateProposal(prompt_new, result);
            // update the description
            // this is poor programming but im tired
            const embed = new discord_js_1.EmbedBuilder().setFooter({ text: 'Barbie Trivia', iconURL: BCONST_1.BCONST.LOGO });
            embed.setTitle(`**Newly Submitted Question**`);
            let user = await client.users.fetch(prompt.getSubmitter());
            let description = `_Proposed Question by ${user.username}:_\n\n`;
            description += `**${prompt.getQuestion()}**`;
            if (prompt_new.getImage().length > 3) {
                embed.setImage(prompt_new.getImage());
            }
            if (prompt_new.getAnswers()[0].length > 0) {
                answer_sent = true;
                let letter;
                for (let i = 0; i < 4; i++) {
                    if (i == 0)
                        letter = "A";
                    else if (i == 1)
                        letter = "B";
                    else if (i == 2)
                        letter = "C";
                    else
                        letter = "D";
                    if (i == prompt_new.getCorrect()) {
                        description += `\n**${letter}. ${prompt_new.getAnswers()[i]}**`;
                    }
                    else {
                        description += `\n${letter}. ${prompt_new.getAnswers()[i]}`;
                    }
                }
                description += `\n\nThe correct answer is \`${prompt_new.getAnswers()[prompt_new.getCorrect()]}\`.`;
            }
            if (prompt_new.getFunFact().length > 2) {
                description += "\n" + prompt_new.getFunFact();
                funfact_sent = true;
            }
            if (prompt_new.getDAlwaysLast()) {
                description += "\n" + "Answer D is always last.";
            }
            else {
                description += "\n" + "Answer order does not matter.";
            }
            embed.setDescription(description);
            inter.editReply({ embeds: [embed], components: [dropdown_ABCD, dropdown_D_Last, btns_deny] });
        }
    });
    return result;
}
