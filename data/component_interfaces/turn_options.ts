import { TurnPlayerOptionsO } from "../component_objects/turn_player_options";
import { TurnTileOptionsO } from "../component_objects/turn_tile_options";

export interface TurnOptions {
    playerOptions: TurnPlayerOptionsO;
    tileOptions: TurnTileOptionsO;
}