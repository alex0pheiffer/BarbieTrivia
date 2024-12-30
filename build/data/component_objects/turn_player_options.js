"use strict";
// import { PlayerMap, TURNTYPE, TurnPlayerOptionsI } from "../component_interfaces/turn_player_options";
// import {VC} from "../../visual/VisualConstants"
// import { CacheType, ChatInputCommandInteraction, Interaction } from "discord.js";
// import TRAINC from "../../TRAINC";
// import { GameTrainO, GameTrainsO } from "../data_objects/gameTrain";
Object.defineProperty(exports, "__esModule", { value: true });
// export class TurnPlayerOptionsO {
//     turnType: number;
//     options: Array<string>; // in terms of userID, TRAINC.MEXICAN_TRAIN_NAME etc
//     playerMap: PlayerMap; // a map is necessary in the incredibly rare case someone changes their name during the interaction
//     constructor(json: TurnPlayerOptionsI) {
//         this.turnType = json.turnType;
//         this.options = json.options;
//         this.playerMap = new PlayerMap();
//     }
//     public async getShowOptions(interaction: Interaction<CacheType>, trains: GameTrainsO, doubleTrain: Array<GameTrainO> | null): Promise<Array<string>> {
//         let name: string;
//         let arr = Array<string>();
//         let userID: string;
//         switch (this.turnType) {
//             case TURNTYPE.Double:
//                 for (let i=0; i<doubleTrain!!.length; i++) {
//                     if (doubleTrain!![i].player == TRAINC.MEXICAN_TRAIN_NAME) name = VC.MexicanTrainName;
//                     else if (doubleTrain!![i].player == interaction.user.id) name = VC.YourselfName;
//                     else {
//                         name = await VC.getUsername(interaction, doubleTrain!![i].player);
//                         this.playerMap.addUser(name, doubleTrain!![i].player);
//                     }
//                     arr.push(name);
//                 }
//                 arr.push(VC.DrawName);
//                 return arr;
//             case TURNTYPE.Players:
//                 arr.push(VC.YourselfName);
//                 for (let i=0; i<trains.openTrains.length; i++) {
//                     userID = trains.openTrains[i].player;
//                     if (userID == TRAINC.MEXICAN_TRAIN_NAME) continue;
//                     if (userID == interaction.user.id) continue;
//                     name = await VC.getUsername(interaction, userID);
//                     arr.push(name);
//                     this.playerMap.addUser(name, userID);
//                 }
//                 arr.push(VC.MexicanTrainName);
//                 arr.push(VC.DrawName);    
//                 return arr;
//             case TURNTYPE.Default:
//             default:
//                 return [VC.YourselfName, VC.MexicanTrainName, VC.DrawName];
//         }
//     }
//     // convert the choice in user-text back to code-lingo
//     public getChoice(userID: string, choice: string): string | null {
//         let c: string | null;
//         switch (choice) {
//             case VC.YourselfName:
//                 c = userID;
//                 break;
//             case VC.MexicanTrainName:
//                 c = TRAINC.MEXICAN_TRAIN_NAME;
//                 break;
//             case VC.DrawName:
//                 c = TRAINC.DRAW_NAME;
//                 break;
//             default:
//                 c = this.playerMap.getUserID(choice);
//                 break;
//         }
//         return c;
//     }
//     // convert code-lingo to user-view text
//     public getChoiceString(userID: string, choice: string): string | null {
//         if (choice == userID) return VC.YourselfName;
//         if (choice == TRAINC.MEXICAN_TRAIN_NAME) return VC.MexicanTrainName;
//         if (choice == TRAINC.DRAW_NAME) return VC.DrawName;
//         return this.playerMap.getUsername(choice);
//     }
//     public isValid(userID: string, choice: string): boolean {
//         // convert the choice back to code-lingo
//         let c = this.getChoice(userID, choice);
//         // if the choice didn't exist in the first place, it's not valid
//         if (c == null) return false;
//         // check if the string is in the valid option list
//         return (this.options.find((s) => (s == c))) ? true : false;
//     }
// }
