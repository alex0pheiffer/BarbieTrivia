import { Channel, Client, EmbedBuilder, TextChannel } from "discord.js";
import { BCONST } from "./BCONST";
import { DO } from "./data/DOBuilder";
import { GameInteractionErr } from "./Errors";
import { createNewQuestion } from "./new";

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
            let thumbnail = BCONST.MAXIMUS_IMAGES[Math.floor(Math.random()*BCONST.MAXIMUS_IMAGES.length)].url;
            const embed = new EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
            embed.setTitle('**Restart Error**');
            let description = `There appeared to have been an error. The last question is going to be re-submitted, and all users will need to reply again. We apologize for any inconvinence this may cause.`;
            embed.setDescription(description);
            channel.send({ embeds:[embed]});

            // create the new question
            if (latest_question[0].getActive() > 0) {
                createNewQuestion(qc.getServer()!!, qc.getChannel(), client, latest_question[0].getQuestionID());
            }
            else {
                createNewQuestion(qc.getServer()!!, qc.getChannel(), client);
            }
        }            
    }   
}