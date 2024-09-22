export interface TurnTileOptionsI {
    // turn type (shown options)
    turnType: number;
    // actual options
    // { userID: Array<string>, TRAINC.MEXICAN_TRAIN_NAME: Array<string>, etc}
    // where Array<string> are the tiles valid for that train
    options: any;
}