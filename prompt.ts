import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Channel, ChatInputCommandInteraction, Client, ComponentType, EmbedBuilder, Events, Message, MessageComponentInteraction, ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction, StringSelectMenuBuilder, StringSelectMenuInteraction, TextChannel, TextInputBuilder, TextInputStyle, User } from "discord.js";
import { BCONST } from "./BCONST";
import { ProposalO } from "./data/data_objects/proposal";
import { DO } from "./data/DOBuilder";
import { GameInteractionErr } from "./Errors";
import { ProposalI } from "./data/data_interfaces/proposal";
import { DropdownItem } from "./data/component_interfaces/dropdown_item";
import { QuestionO } from "./data/data_objects/question";
import { PlayerI } from "./data/data_interfaces/player";

// hour time out period
const modal_timeout = 60 * 60 * 1000;

export async function addPrompt(interaction: ChatInputCommandInteraction): Promise<number> {
    let result = 0;

    // display the new question
    result = await createFirstModal(interaction, -1, null, false);

    return result;
}

async function createFirstModal(interaction: ChatInputCommandInteraction | ButtonInteraction, current_prompt: number, master_message: Message | null, isAdminCheck: boolean): Promise<number> {
    let result = 0;
    let prompt: ProposalO | null = null;

    if (current_prompt >= 0) {
        prompt = await DO.getProposal(current_prompt);
        if (prompt == null) {
            result = GameInteractionErr.QuestionDoesNotExist;
        }
    }

    const modal = new ModalBuilder().setCustomId(BCONST.MODAL_PROMPT);
    modal.setTitle(`Question Input`);
    const QuestionInput = new TextInputBuilder()
			.setCustomId(BCONST.MODAL_QUESTION_INPUT)
			.setLabel("Please enter your question.")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short)
            .setMaxLength(500)
	        .setMinLength(10)
	        .setRequired(true);
    if (current_prompt >= 0 && !result) {
        QuestionInput.setValue(prompt!!.getQuestion());
    }
    const ImageInput = new TextInputBuilder()
            .setCustomId(BCONST.MODAL_IMAGE_INPUT)
            .setLabel("[OPTIONAL] If about an image, enter the url.")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Hint: Send the image in discord and copy the url.")
            .setMaxLength(500)
            .setMinLength(10)
            .setRequired(false);
    if (current_prompt >= 0 && !result && prompt!!.getImage().length > 3) {
        ImageInput.setValue(prompt!!.getImage());
    }
    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(QuestionInput);
    const sixthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(ImageInput);

    // Add inputs to the modal
    modal.addComponents(firstActionRow, sixthActionRow);
    interaction.showModal(modal);

    try {
        const modal_result = await interaction.awaitModalSubmit({
            filter: async (i) => {
                const filter =
                    i.user.id === interaction.user.id &&
                    i.customId === BCONST.MODAL_PROMPT;
                if (filter) {
                    if (isAdminCheck) {
                        await i.deferReply({ephemeral: false});
                    }
                    else {
                        await i.deferReply({ephemeral: true});
                    }
                }
                return filter;
            },
            time: modal_timeout,
        });

        //await modal_result.editReply(modal_result.fields.getTextInputValue(BCONST.MODAL_QUESTION_INPUT));
        // update the prompt information
        let question_input = modal_result.fields.getTextInputValue(BCONST.MODAL_QUESTION_INPUT);
        let image_input  = modal_result.fields.getTextInputValue(BCONST.MODAL_IMAGE_INPUT);
        if (prompt != null) {
            prompt.setQuestion(question_input);
            if (image_input.length > 3) {
                prompt.setImage(image_input);
            }
            result = await DO.updateProposal(prompt, result);
        }
        else {
            let prompt_interface = {"proposal_id": 0,
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
                    "submitted": 0} as ProposalI;
                prompt = new ProposalO(prompt_interface);
            result = await DO.insertProposal(prompt);
            prompt = await DO.getProposalByQuestion(question_input);
            if (prompt == null) {
                result = GameInteractionErr.SQLConnectionError;
            }
        }

        // send the current version of the question for viewing
        if (!result) {
            if (isAdminCheck) {
                result = await adminCheckEmbed(modal_result, modal_result.client, prompt!!, false);
            }
            else {
                result = await createEmbedResult(modal_result, prompt!!, master_message);
            }
        }

    } catch (e) {
        // do nothing
        console.log(e);
        console.log("Modal Timed Out");
    }
    
    return result;
}

async function createSecondModal(interaction: ChatInputCommandInteraction | ButtonInteraction, current_prompt: number, master_message: Message, isAdminCheck: boolean): Promise<number> {
    let result = 0;
    let prompt: ProposalO | null = null;

    if (current_prompt >= 0) {
        prompt = await DO.getProposal(current_prompt);
        if (prompt == null) {
            result = GameInteractionErr.QuestionDoesNotExist;
        }
    }

    const modal2 = new ModalBuilder().setCustomId(BCONST.MODAL_PROMPT2);
    modal2.setTitle(`Answer Inputs`);

    const AnsAInput = new TextInputBuilder()
            .setCustomId("Answer A Input")
            .setLabel("Answer option A.")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short)
            .setMaxLength(200)
            .setMinLength(1)
            .setRequired(true);
    if (current_prompt >= 0 && !result && prompt!!.getAnswers()[0].length > 0) {
        AnsAInput.setValue(prompt!!.getAnswers()[0]);
    }
    const AnsBInput = new TextInputBuilder()
            .setCustomId(BCONST.MODAL_ANS_B_INPUT)
            .setLabel("Answer option B.")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short)
            .setMaxLength(200)
            .setMinLength(1)
            .setRequired(true);
    if (current_prompt >= 0 && !result && prompt!!.getAnswers()[1].length > 0) {
        AnsBInput.setValue(prompt!!.getAnswers()[1]);
    }
    const AnsCInput = new TextInputBuilder()
            .setCustomId(BCONST.MODAL_ANS_C_INPUT)
            .setLabel("Answer option C.")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short)
            .setMaxLength(200)
            .setMinLength(1)
            .setRequired(true);
    if (current_prompt >= 0 && !result && prompt!!.getAnswers()[2].length > 0) {
        AnsCInput.setValue(prompt!!.getAnswers()[2]);
    }
    const AnsDInput = new TextInputBuilder()
            .setCustomId(BCONST.MODAL_ANS_D_INPUT)
            .setLabel("Answer option D.")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short)
            .setMaxLength(200)
            .setMinLength(1)
            .setRequired(true);
    if (current_prompt >= 0 && !result && prompt!!.getAnswers()[3].length > 0) {
        AnsDInput.setValue(prompt!!.getAnswers()[3]);
    }

    // An action row only holds one text input,
    // so you need one action row per text input.
    const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(AnsAInput);
    const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(AnsBInput);
    const fourthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(AnsCInput);
    const fifthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(AnsDInput);
    
    modal2.addComponents(secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);
    interaction.showModal(modal2);

    try {
        const modal_result2 = await interaction.awaitModalSubmit({
            filter: async (i) => {
                const filter =
                    i.user.id === interaction.user.id &&
                    i.customId === BCONST.MODAL_PROMPT2;
                if (filter) {
                    if (isAdminCheck) {
                        await i.deferReply({ephemeral: false});
                    }
                    else {
                        await i.deferReply({ephemeral: true});
                    }
                }
                return filter;
            },
            time: modal_timeout,
        });

        let ansA_input = modal_result2.fields.getTextInputValue(BCONST.MODAL_ANS_A_INPUT);
        let ansB_input = modal_result2.fields.getTextInputValue(BCONST.MODAL_ANS_B_INPUT);
        let ansC_input = modal_result2.fields.getTextInputValue(BCONST.MODAL_ANS_C_INPUT);
        let ansD_input = modal_result2.fields.getTextInputValue(BCONST.MODAL_ANS_D_INPUT);
        if (prompt != null) {
            prompt.setAnsA(ansA_input);
            prompt.setAnsB(ansB_input);
            prompt.setAnsC(ansC_input);
            prompt.setAnsD(ansD_input);
            result = await DO.updateProposal(prompt, result);
        }
        else {
            result = GameInteractionErr.QuestionDoesNotExist;
        }

        // send the current version of the question for viewing
        if (!result) {
            if (isAdminCheck) {
                result = await adminCheckEmbed(modal_result2, modal_result2.client, prompt!!, false);
            }
            else {
                result = await createEmbedResult(modal_result2, prompt!!, master_message);
            }
        }

    } catch (e) {
        // do nothing
        console.log(e);
        console.log("Modal Timed Out 2");
    }

    return result;
}

async function createThirdModal(interaction: ChatInputCommandInteraction | ButtonInteraction, current_prompt: number, master_message: Message, isAdminCheck: boolean): Promise<number> {
    let result = 0;
    let prompt: ProposalO | null = null;

    if (current_prompt >= 0) {
        prompt = await DO.getProposal(current_prompt);
        if (prompt == null) {
            result = GameInteractionErr.QuestionDoesNotExist;
        }
    }

    const modal3 = new ModalBuilder().setCustomId(BCONST.MODAL_PROMPT3);
    modal3.setTitle(`Fun Fact Input`);

    const FunFactInput = new TextInputBuilder()
            .setCustomId(BCONST.MODAL_FUNFACT_INPUT)
            .setLabel("Answer's Fun Fact")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(500)
            .setMinLength(10)
            .setRequired(false);
    if (current_prompt >= 0 && !result && prompt!!.getFunFact().length > 0) {
        FunFactInput.setValue(prompt!!.getFunFact());
    }
    
    const seventhActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(FunFactInput);
    
    modal3.addComponents(seventhActionRow);

    interaction.showModal(modal3);

    try {
        const modal_result3 = await interaction.awaitModalSubmit({
            filter: async (i) => {
                const filter =
                    i.user.id === interaction.user.id &&
                    i.customId === BCONST.MODAL_PROMPT3;
                if (filter) {
                    if (isAdminCheck) {
                        await i.deferReply({ephemeral: false});
                    }
                    else {
                        await i.deferReply({ephemeral: true});
                    }
                }
                return filter;
            },
            time: modal_timeout,
        });

        let funfact_input = modal_result3.fields.getTextInputValue(BCONST.MODAL_FUNFACT_INPUT);
            if (prompt != null) {
                prompt.setFunFact(funfact_input);
                result = await DO.updateProposal(prompt, result);
            }
            else {
                result = GameInteractionErr.QuestionDoesNotExist;
            }

        // send the current version of the question for viewing
        if (!result) {
            if (isAdminCheck) {
                result = await adminCheckEmbed(modal_result3, modal_result3.client, prompt!!, false);
            }
            else {
                result = await createEmbedResult(modal_result3, prompt!!, master_message);
            }
        }

    } catch (e) {
        // do nothing
        console.log(e);
        console.log("Modal Timed Out 3");
    }

    return result;
}

async function createEmbedResult(interaction: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction, prompt: ProposalO, master_message: Message | null): Promise<number> {
    let result = 0;
    let answer_sent = false;
    let funfact_sent = false;

    const embed = new EmbedBuilder().setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
    embed.setTitle(`**Submit New Question**`);
    let description = "_Your question so far:_\n\n";
    description += `**${prompt.getQuestion()}**`;
    if (prompt.getImage().length > 3) {
        embed.setImage(prompt!!.getImage());
    }
    if (prompt.getAnswers()[0].length > 0) {
        answer_sent = true;
        let letter: string;
        for (let i=0; i < 4; i++) {
            if (i == 0) letter = "A"
            else if (i == 1) letter = "B"
            else if (i == 2) letter = "C"
            else letter = "D"
            if (i == prompt.getCorrect()) {
                description += `\n**${letter}. ${prompt.getAnswers()[i]}**`;
            }
            else {
                description += `\n${letter}. ${prompt.getAnswers()[i]}`;
            }
        }
        description += `\n\nThe correct answer is \`${prompt.getAnswers()[prompt!!.getCorrect()]}\`.`;
        
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
    
    let ans_title: string;
    let ans_style: ButtonStyle;
    let funfact_title: string;
    let funfact_style: ButtonStyle;
    let submit_style: ButtonStyle;
    let itemsDropDown_abcd = Array<DropdownItem>();
    let itemsDropDown_d_always_last = Array<DropdownItem>();
    if (answer_sent) {
        ans_title = "Edit Answers";
        ans_style = ButtonStyle.Secondary;
        submit_style = ButtonStyle.Primary;
        itemsDropDown_abcd.push({"description": `A. ${prompt.getAnswers()[0]}`, "label": "A", "value": "0"});
        itemsDropDown_abcd.push({"description": `B. ${prompt.getAnswers()[1]}`, "label": "B", "value": "1"});
        itemsDropDown_abcd.push({"description": `C. ${prompt.getAnswers()[2]}`, "label": "C", "value": "2"});
        itemsDropDown_abcd.push({"description": `D. ${prompt.getAnswers()[3]}`, "label": "D", "value": "3"});
    }
    else {
        ans_title = "Add Answers";
        ans_style = ButtonStyle.Primary;
        submit_style = ButtonStyle.Secondary;
        itemsDropDown_abcd.push({"description": "Option A.", "label": "A", "value": "0"});
        itemsDropDown_abcd.push({"description": "Option B.", "label": "B", "value": "1"});
        itemsDropDown_abcd.push({"description": "Option C.", "label": "C", "value": "2"});
        itemsDropDown_abcd.push({"description": "Option D.", "label": "D", "value": "3"});
    }
    if (funfact_sent) {
        funfact_title = "Edit Fun Fact";
        funfact_style = ButtonStyle.Secondary;
    }
    else {
        funfact_title = "Add Fun Fact";
        funfact_style = ButtonStyle.Primary;
    }
    itemsDropDown_d_always_last.push({"description": `None of the answer choice order matters.`, "label": "Any Order", "value": "0"});
    itemsDropDown_d_always_last.push({"description": `Answer D should always be last.`, "label": "D Last", "value": "1"});
    

    const btn_question: any = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(BCONST.BTN_QUESTION).setLabel("Edit Question").setStyle(ButtonStyle.Secondary));
    const  btns_answer: any = btn_question.addComponents(
        new ButtonBuilder().setCustomId(BCONST.BTN_ANSWER).setLabel(ans_title).setStyle(ans_style));    
    const btns_funfact: any = btns_answer.addComponents(
        new ButtonBuilder().setCustomId(BCONST.BTN_FUNFACT).setLabel(funfact_title).setStyle(funfact_style));
    const btns_submit: any = btns_funfact.addComponents(
        new ButtonBuilder().setCustomId(BCONST.BTN_PROPOSAL_SUBMIT).setLabel("Submit").setStyle(submit_style));
    
    // create in-between button
    
    const dropdown_ABCD: any = new ActionRowBuilder().addComponents( new StringSelectMenuBuilder().setCustomId(BCONST.DROPDOWN_ABCD).setPlaceholder('Select the correct answer:').addOptions(itemsDropDown_abcd));
    const dropdown_D_Last: any = new ActionRowBuilder().addComponents( new StringSelectMenuBuilder().setCustomId(BCONST.DROPDOWN_DLAST).setPlaceholder('Should option D always be last?').addOptions(itemsDropDown_d_always_last));
    let message: any;
    // master_message was intended to allow for me to edit the ephemeral message.
    // alas, it isn't working so i am going to move on
    if (true) {
        message = await interaction.editReply({embeds: [embed], components: [btns_submit, dropdown_ABCD, dropdown_D_Last] });
        master_message = message;
    }
    else {
        message = await (master_message as any).update({embeds: [embed], components: [btns_submit, dropdown_ABCD] })
    }
    
    
    const filter_btn = (inter: MessageComponentInteraction) => (inter.customId === BCONST.BTN_QUESTION || inter.customId === BCONST.BTN_ANSWER || inter.customId === BCONST.BTN_FUNFACT || inter.customId === BCONST.BTN_PROPOSAL_SUBMIT);
    const filter_dropdown = (inter: MessageComponentInteraction) => inter.customId === BCONST.DROPDOWN_ABCD;
    const filter_dropdown_d = (inter: MessageComponentInteraction) => inter.customId === BCONST.DROPDOWN_DLAST;
    const btn_collector = message.createMessageComponentCollector({ filter: filter_btn, componentType: ComponentType.Button});
    const collector_drop = message.createMessageComponentCollector({filter: filter_dropdown});
    const collector_drop_d = message.createMessageComponentCollector({filter: filter_dropdown_d});
    btn_collector.on('collect', async (inter: ButtonInteraction) => {
        if (prompt.getProposalID() == null) {
            result = GameInteractionErr.QuestionDoesNotExist;
        }
        else {
            buttonResponse(inter, prompt.getProposalID()!!, master_message!!, false).then(async (err) => {
                let resp = "";
                switch (err) {
                    case 0: 
                        break;
                    case GameInteractionErr.QuestionDoesNotExist:
                        resp = "The proposal did not get formed correctly.";
                        break;
                    case GameInteractionErr.NoAnswerSelected:
                    case GameInteractionErr.QuestionExpired:
                    case GameInteractionErr.GuildDataUnavailable:
                    case GameInteractionErr.SQLConnectionError:
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
    btn_collector.on('end', (collected: string) => {
        // nothing 
    });
    collector_drop.on('collect', async (inter: StringSelectMenuInteraction) => {
        await inter.deferUpdate();
        let proposal_id = prompt!!.getProposalID()!!;
        let result = 0;
        // get the current proposal
        let prompt_new: ProposalO | null = null;
        if (proposal_id >= 0) {
            prompt_new = await DO.getProposal(proposal_id);
            if (prompt == null) {
                result = GameInteractionErr.QuestionDoesNotExist;
            }
        }

        if (!result) {
            prompt_new!!.setCorrect(Number(inter.values[0]))
            result = await DO.updateProposal(prompt_new!!, result);

            // update the description
            // this is poor programming but im tired
            const embed = new EmbedBuilder().setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
            embed.setTitle(`**Submit New Question**`);
            let description = "_Your question so far:_\n\n";
            description += `**${prompt_new!!.getQuestion()}**`;
            if (prompt_new!!.getImage().length > 3) {
                embed.setImage(prompt_new!!.getImage());
            }
            if (prompt_new!!.getAnswers()[0].length > 0) {
                answer_sent = true;
                let letter: string;
                for (let i=0; i < 4; i++) {
                    if (i == 0) letter = "A"
                    else if (i == 1) letter = "B"
                    else if (i == 2) letter = "C"
                    else letter = "D"
                    if (i == prompt_new!!.getCorrect()) {
                        description += `\n**${letter}. ${prompt_new!!.getAnswers()[i]}**`;
                    }
                    else {
                        description += `\n${letter}. ${prompt_new!!.getAnswers()[i]}`;
                    }
                }
                description += `\n\nThe correct answer is \`${prompt_new!!.getAnswers()[prompt_new!!.getCorrect()]}\`.`;
                
            }
            if (prompt_new!!.getFunFact().length > 2) {
                description += "\n" + prompt_new!!.getFunFact();
                funfact_sent = true;
            }           
            if (prompt_new!!.getDAlwaysLast()) {
                description += "\n" + "Answer D is always last.";
            }
            else {
                description += "\n" + "Answer order does not matter.";
            }
            
            embed.setDescription(description);
            inter.editReply({embeds: [embed], components: [btns_submit, dropdown_ABCD, dropdown_D_Last] });
            
        }
    });
    collector_drop.on('end', (collected: string) => {
        // nothing
    });
    collector_drop_d.on('collect', async (inter: StringSelectMenuInteraction) => {
        await inter.deferUpdate();
        let proposal_id = prompt!!.getProposalID()!!;
        let result = 0;
        // get the current proposal
        let prompt_new: ProposalO | null = null;
        if (proposal_id >= 0) {
            prompt_new = await DO.getProposal(proposal_id);
            if (prompt == null) {
                result = GameInteractionErr.QuestionDoesNotExist;
            }
        }

        if (!result) {
            prompt_new!!.setDAlwaysLast(Boolean(Number(inter.values[0])))
            result = await DO.updateProposal(prompt_new!!, result);

            // update the description
            // this is poor programming but im tired
            const embed = new EmbedBuilder().setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
            embed.setTitle(`**Submit New Question**`);
            let description = "_Your question so far:_\n\n";
            description += `**${prompt_new!!.getQuestion()}**`;
            if (prompt_new!!.getImage().length > 3) {
                embed.setImage(prompt_new!!.getImage());
            }
            if (prompt_new!!.getAnswers()[0].length > 0) {
                answer_sent = true;
                let letter: string;
                for (let i=0; i < 4; i++) {
                    if (i == 0) letter = "A"
                    else if (i == 1) letter = "B"
                    else if (i == 2) letter = "C"
                    else letter = "D"
                    if (i == prompt_new!!.getCorrect()) {
                        description += `\n**${letter}. ${prompt_new!!.getAnswers()[i]}**`;
                    }
                    else {
                        description += `\n${letter}. ${prompt_new!!.getAnswers()[i]}`;
                    }
                }
                description += `\n\nThe correct answer is \`${prompt_new!!.getAnswers()[prompt_new!!.getCorrect()]}\`.`;
                
            }
            if (prompt_new!!.getFunFact().length > 2) {
                description += "\n" + prompt_new!!.getFunFact();
                funfact_sent = true;
            }   
            if (prompt_new!!.getDAlwaysLast()) {
                description += "\n" + "Answer D is always last.";
            }
            else {
                description += "\n" + "Answer order does not matter.";
            }
            
            embed.setDescription(description);
            inter.editReply({embeds: [embed], components: [btns_submit, dropdown_ABCD, dropdown_D_Last] });
        }
    });
    
    return result;
}

async function buttonResponse(interaction: ButtonInteraction, proposal_id: number, master_message: Message, isAdminCheck: boolean): Promise<number> {
    let result = 0;

    // get the current proposal
    let prompt: ProposalO | null = null;
    if (proposal_id >= 0) {
        prompt = await DO.getProposal(proposal_id);
        if (prompt == null) {
            result = GameInteractionErr.QuestionDoesNotExist;
        }
    }
    if (!result) {
        switch (interaction.customId) {
            case BCONST.BTN_QUESTION:
                result = await createFirstModal(interaction, proposal_id, master_message, isAdminCheck);
                break;
            case BCONST.BTN_ANSWER:
                result = await createSecondModal(interaction, proposal_id, master_message, isAdminCheck);
                break;
            case BCONST.BTN_FUNFACT:
                result = await createThirdModal(interaction, proposal_id, master_message, isAdminCheck);
                break;
            case BCONST.BTN_PROPOSAL_SUBMIT:
                if (prompt!!.getAnswers()[0].length > 0 && 
                    prompt!!.getAnswers()[1].length > 0 && 
                    prompt!!.getAnswers()[2].length > 0 && 
                    prompt!!.getAnswers()[3].length > 0 && 
                    prompt!!.getQuestion().length > 0) {
                    // submit the current prompt
                    prompt!!.setSubmitted(1);
                    const d = new Date();
                    let time = d.getTime();
                    prompt!!.setDate(time);
                    result = await DO.updateProposal(prompt!!, result);
                    
                    // check if the user is an admin;
                    // if theyre not, add it to the Elevator channel
                    let isAdmin = await DO.getAdmin(interaction.user.id);
                    if (isAdmin == null) {
                        interaction.reply({ephemeral: true, content: "Your question has been submitted. Because you are not an admin, it is awaiting approval."});
                        // send message to the elevator
                        result = await chooseQuestion(interaction.client, proposal_id);
                    }
                    else {
                        let question_interface = prompt!!.getQuestionI();
                        let question_object = new QuestionO(question_interface);
                        result = await DO.insertQuestion(question_object);
                        result = await DO.deleteProposal(prompt!!.getProposalID()!!);
                        interaction.reply({ephemeral: true, content: "Your question has been submitted. Because you are an admin, it has been automatically accepted. Congrats."});
                        // update the user's profile
                        let user_profile = await DO.getPlayer(interaction.user.id);
                        if (user_profile != null) {
                            user_profile.setQSubmitted(user_profile.getQSubmitted() + 1);
                            console.log("user profile q submitted: ", user_profile.getQSubmitted());
                            result = await DO.updatePlayer(user_profile, result);
                            console.log("questioni submitted increment update:", result);
                        }
                        else {
                            let new_player = {"player_id": 0, "user": interaction.user.id, "q_submitted": 1, "response_total": 0, "response_correct": 0} as PlayerI;
                            result = await DO.insertPlayer(new_player);
                            console.log("User profile was null; made a new profile");
                        }
                    }
                    // inform the group that a new question was submitted
                    // get the trivia channel
                    if (interaction.guildId) {
                        let quest_channel = await DO.getQuestionChannelByServer(interaction.guildId);
                        if (quest_channel.length > 0) {
                            let channel: Channel | undefined = await interaction.client.channels.cache.get(quest_channel[0].getChannel());
                            if (typeof channel === 'undefined') result = GameInteractionErr.GuildDataUnavailable;
                            channel = channel as TextChannel;
                            let new_message = await channel!!.send("A new question was submitted to the database!");
                        }
                    }
                    
                }
                else {
                    // you cannot submit the current prompt
                    interaction.reply({ephemeral: true, content: "You cannot submit this question until you have a question and answers."});
                }
                break;
            case BCONST.BTN_PROPOSAL_ACCEPT:
                interaction.reply({content: `${interaction.user.username} has chosen to accept this question. It has been added to the pool.`});
                // add as an official question
                let question_interface = prompt!!.getQuestionI();
                let question_object = new QuestionO(question_interface);
                result = await DO.insertQuestion(question_object);
                // delete the prompt
                result = await DO.deleteProposal(prompt!!.getProposalID()!!);
                // update the user's profile
                let user_profile = await DO.getPlayer(prompt!!.getSubmitter());
                if (user_profile != null) {
                    user_profile.setQSubmitted(user_profile.getQSubmitted() + 1);
                    result = await DO.updatePlayer(user_profile, result);
                }
                else {
                    let new_player = {"player_id": 0, "user": interaction.user.id, "q_submitted": 1, "response_total": 0, "response_correct": 0} as PlayerI;
                    result = await DO.insertPlayer(new_player);
                }
                break;
            case BCONST.BTN_PROPOSAL_DECLINE:
                interaction.reply({content: `${interaction.user.username} has chosen to decline this question. It has been deleted.`});
                // delete the prompt
                result = await DO.deleteProposal(prompt!!.getProposalID()!!);
                break;
            default:
                result = GameInteractionErr.GuildDataUnavailable;
        }
    }

    return result;
}

export async function chooseQuestion(client: Client, proposal_id: number): Promise<number> {
    let result = 0;
    
    // get the current proposal
    let prompt: ProposalO | null = null;
    if (proposal_id >= 0) {
        prompt = await DO.getProposal(proposal_id);
        if (prompt == null) {
            result = GameInteractionErr.QuestionDoesNotExist;
        }
    }

    if (!result) {
        result = await adminCheckEmbed(null, client, prompt!!, true);
    }

    return 0;
}


async function adminCheckEmbed(interaction: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction | null, client: Client, prompt: ProposalO, isFirstPass: boolean): Promise<number> {
    let result = 0;
    let answer_sent = false;
    let funfact_sent = false;

    const embed = new EmbedBuilder().setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
    embed.setTitle(`**Newly Submitted Question**`);
    
    let user = await client.users.fetch(prompt!!.getSubmitter());
    let description = `_Proposed Question by ${user.username}:_\n\n`;
    description += `**${prompt!!.getQuestion()}**`;
    if (prompt!!.getImage().length > 3) {
        embed.setImage(prompt!!.getImage());
    }
    if (prompt!!.getAnswers()[0].length > 0) {
        answer_sent = true;
        let letter: string;
        for (let i=0; i < 4; i++) {
            if (i == 0) letter = "A"
            else if (i == 1) letter = "B"
            else if (i == 2) letter = "C"
            else letter = "D"
            if (i == prompt!!.getCorrect()) {
                description += `\n**${letter}. ${prompt!!.getAnswers()[i]}**`;
            }
            else {
                description += `\n${letter}. ${prompt!!.getAnswers()[i]}`;
            }
        }
        description += `\n\nThe correct answer is \`${prompt!!.getAnswers()[prompt!!.getCorrect()]}\`.`;
        
    }
    if (prompt!!.getFunFact().length > 2) {
        description += "\n" + prompt!!.getFunFact();
        funfact_sent = true;
    }     
    if (prompt!!.getDAlwaysLast()) {
        description += "\n" + "Answer D is always last.";
    }
    else {
        description += "\n" + "Answer order does not matter.";
    }

    embed.setDescription(description);
    
    let ans_title: string;
    let ans_style: ButtonStyle;
    let funfact_title: string;
    let funfact_style: ButtonStyle;
    let submit_style: ButtonStyle;
    let itemsDropDown_abcd = Array<DropdownItem>();
    let itemsDropDown_d_always_last = Array<DropdownItem>();
    if (answer_sent) {
        ans_title = "Edit Answers";
        ans_style = ButtonStyle.Secondary;
        submit_style = ButtonStyle.Primary;
        itemsDropDown_abcd.push({"description": `A. ${prompt!!.getAnswers()[0]}`, "label": "A", "value": "0"});
        itemsDropDown_abcd.push({"description": `B. ${prompt!!.getAnswers()[1]}`, "label": "B", "value": "1"});
        itemsDropDown_abcd.push({"description": `C. ${prompt!!.getAnswers()[2]}`, "label": "C", "value": "2"});
        itemsDropDown_abcd.push({"description": `D. ${prompt!!.getAnswers()[3]}`, "label": "D", "value": "3"});
    }
    else {
        ans_title = "Add Answers";
        ans_style = ButtonStyle.Primary;
        submit_style = ButtonStyle.Secondary;
        itemsDropDown_abcd.push({"description": "Option A.", "label": "A", "value": "0"});
        itemsDropDown_abcd.push({"description": "Option B.", "label": "B", "value": "1"});
        itemsDropDown_abcd.push({"description": "Option C.", "label": "C", "value": "2"});
        itemsDropDown_abcd.push({"description": "Option D.", "label": "D", "value": "3"});
    }
    if (funfact_sent) {
        funfact_title = "Edit Fun Fact";
        funfact_style = ButtonStyle.Secondary;
    }
    else {
        funfact_title = "Add Fun Fact";
        funfact_style = ButtonStyle.Primary;
    }
    itemsDropDown_d_always_last.push({"description": `None of the answer choice order matters.`, "label": "Any Order", "value": "0"});
    itemsDropDown_d_always_last.push({"description": `Answer D should always be last.`, "label": "D Last", "value": "1"});
    

    const btn_question: any = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(BCONST.BTN_QUESTION).setLabel("Edit Question").setStyle(ButtonStyle.Secondary));
    const  btns_answer: any = btn_question.addComponents(
        new ButtonBuilder().setCustomId(BCONST.BTN_ANSWER).setLabel(ans_title).setStyle(ans_style));    
    const btns_funfact: any = btns_answer.addComponents(
        new ButtonBuilder().setCustomId(BCONST.BTN_FUNFACT).setLabel(funfact_title).setStyle(funfact_style));
    const btns_submit: any = btns_funfact.addComponents(
        new ButtonBuilder().setCustomId(BCONST.BTN_PROPOSAL_ACCEPT).setLabel("Accept").setStyle(submit_style));
    const btns_deny: any = btns_submit.addComponents(
        new ButtonBuilder().setCustomId(BCONST.BTN_PROPOSAL_DECLINE).setLabel("Decline").setStyle(ButtonStyle.Danger));
    
    // create in-between button
    
    const dropdown_ABCD: any = new ActionRowBuilder().addComponents( new StringSelectMenuBuilder().setCustomId(BCONST.DROPDOWN_ABCD).setPlaceholder('Select the correct answer:').addOptions(itemsDropDown_abcd));
    const dropdown_D_Last: any = new ActionRowBuilder().addComponents( new StringSelectMenuBuilder().setCustomId(BCONST.DROPDOWN_DLAST).setPlaceholder('Should option D always be last?').addOptions(itemsDropDown_d_always_last));
    let channel: Channel | undefined = await client.channels.cache.get(BCONST.MASTER_PROMPT_CHANNEL!!);
    if (typeof channel === 'undefined') result = GameInteractionErr.GuildDataUnavailable;
    channel = channel as TextChannel;
    let message: any;
    if (isFirstPass) {
        message = await channel.send({embeds: [embed], components: [dropdown_ABCD, dropdown_D_Last, btns_deny] });
    }
    else if (interaction != null) {
        message = await interaction.editReply({embeds: [embed], components: [dropdown_ABCD, dropdown_D_Last, btns_deny] });
    }
    
    const filter_btn = (inter: MessageComponentInteraction) => (inter.customId === BCONST.BTN_QUESTION || inter.customId === BCONST.BTN_ANSWER || inter.customId === BCONST.BTN_FUNFACT || inter.customId === BCONST.BTN_PROPOSAL_ACCEPT || inter.customId === BCONST.BTN_PROPOSAL_DECLINE);
    const filter_dropdown = (inter: MessageComponentInteraction) => inter.customId === BCONST.DROPDOWN_ABCD;
    const filter_dropdown_d = (inter: MessageComponentInteraction) => inter.customId === BCONST.DROPDOWN_DLAST;
    const btn_collector = message.createMessageComponentCollector({ filter: filter_btn, componentType: ComponentType.Button});
    const collector_drop = message.createMessageComponentCollector({filter: filter_dropdown});
    const collector_drop_d = message.createMessageComponentCollector({filter: filter_dropdown_d});
    btn_collector.on('collect', async (inter: ButtonInteraction) => {
        if (prompt!!.getProposalID() == null) {
            result = GameInteractionErr.QuestionDoesNotExist;
        }
        else {
            buttonResponse(inter, prompt!!.getProposalID()!!, message!!, true).then(async (err) => {
                let resp = "";
                switch (err) {
                    case 0: 
                        break;
                    case GameInteractionErr.QuestionDoesNotExist:
                        resp = "The proposal has ended.";
                        break;
                    case GameInteractionErr.NoAnswerSelected:
                    case GameInteractionErr.QuestionExpired:
                    case GameInteractionErr.GuildDataUnavailable:
                    case GameInteractionErr.SQLConnectionError:
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
    btn_collector.on('end', (collected: string) => {
        // nothing 
    });
    collector_drop.on('collect', async (inter: StringSelectMenuInteraction) => {
        await inter.deferUpdate();
        let proposal_id = prompt!!.getProposalID()!!;
        let result = 0;
        // get the current proposal
        let prompt_new: ProposalO | null = null;
        if (proposal_id >= 0) {
            prompt_new = await DO.getProposal(proposal_id);
            if (prompt == null) {
                result = GameInteractionErr.QuestionDoesNotExist;
            }
        }

        if (!result) {
            prompt_new!!.setCorrect(Number(inter.values[0]))
            result = await DO.updateProposal(prompt_new!!, result);

            // update the description
            // this is poor programming but im tired
            const embed = new EmbedBuilder().setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
            embed.setTitle(`**Newly Submitted Question**`);
            let user = await client.users.fetch(prompt!!.getSubmitter());
            let description = `_Proposed Question by ${user.username}:_\n\n`;
            description += `**${prompt!!.getQuestion()}**`;
            if (prompt_new!!.getImage().length > 3) {
                embed.setImage(prompt_new!!.getImage());
            }
            if (prompt_new!!.getAnswers()[0].length > 0) {
                answer_sent = true;
                let letter: string;
                for (let i=0; i < 4; i++) {
                    if (i == 0) letter = "A"
                    else if (i == 1) letter = "B"
                    else if (i == 2) letter = "C"
                    else letter = "D"
                    if (i == prompt_new!!.getCorrect()) {
                        description += `\n**${letter}. ${prompt_new!!.getAnswers()[i]}**`;
                    }
                    else {
                        description += `\n${letter}. ${prompt_new!!.getAnswers()[i]}`;
                    }
                }
                description += `\n\nThe correct answer is \`${prompt_new!!.getAnswers()[prompt_new!!.getCorrect()]}\`.`;
                
            }
            if (prompt_new!!.getFunFact().length > 2) {
                description += "\n" + prompt_new!!.getFunFact();
                funfact_sent = true;
            }           
            if (prompt_new!!.getDAlwaysLast()) {
                description += "\n" + "Answer D is always last.";
            }
            else {
                description += "\n" + "Answer order does not matter.";
            }
            
            embed.setDescription(description);
            inter.editReply({embeds: [embed], components: [dropdown_ABCD, dropdown_D_Last, btns_deny] });
            
        }
    });
    collector_drop.on('end', (collected: string) => {
        // nothing
    });
    collector_drop_d.on('collect', async (inter: StringSelectMenuInteraction) => {
        await inter.deferUpdate();
        let proposal_id = prompt!!.getProposalID()!!;
        let result = 0;
        // get the current proposal
        let prompt_new: ProposalO | null = null;
        if (proposal_id >= 0) {
            prompt_new = await DO.getProposal(proposal_id);
            if (prompt == null) {
                result = GameInteractionErr.QuestionDoesNotExist;
            }
        }

        if (!result) {
            prompt_new!!.setDAlwaysLast(Boolean(Number(inter.values[0])))
            result = await DO.updateProposal(prompt_new!!, result);

            // update the description
            // this is poor programming but im tired
            const embed = new EmbedBuilder().setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
            embed.setTitle(`**Newly Submitted Question**`);
            let user = await client.users.fetch(prompt!!.getSubmitter());
            let description = `_Proposed Question by ${user.username}:_\n\n`;
            description += `**${prompt!!.getQuestion()}**`;
            if (prompt_new!!.getImage().length > 3) {
                embed.setImage(prompt_new!!.getImage());
            }
            if (prompt_new!!.getAnswers()[0].length > 0) {
                answer_sent = true;
                let letter: string;
                for (let i=0; i < 4; i++) {
                    if (i == 0) letter = "A"
                    else if (i == 1) letter = "B"
                    else if (i == 2) letter = "C"
                    else letter = "D"
                    if (i == prompt_new!!.getCorrect()) {
                        description += `\n**${letter}. ${prompt_new!!.getAnswers()[i]}**`;
                    }
                    else {
                        description += `\n${letter}. ${prompt_new!!.getAnswers()[i]}`;
                    }
                }
                description += `\n\nThe correct answer is \`${prompt_new!!.getAnswers()[prompt_new!!.getCorrect()]}\`.`;
                
            }
            if (prompt_new!!.getFunFact().length > 2) {
                description += "\n" + prompt_new!!.getFunFact();
                funfact_sent = true;
            }   
            if (prompt_new!!.getDAlwaysLast()) {
                description += "\n" + "Answer D is always last.";
            }
            else {
                description += "\n" + "Answer order does not matter.";
            }
            
            embed.setDescription(description);
            inter.editReply({embeds: [embed], components: [dropdown_ABCD, dropdown_D_Last, btns_deny] });
        }
    });

    return result;
}