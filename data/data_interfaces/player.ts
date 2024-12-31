// player data
// player_id         :   int
// user              :   20char str
// q_submitted       :   int
// response_total    :   int
// response_correct  :   int

export interface PlayerI {
    player_id: number;
    user: string;
    q_submitted: number;
    response_total: number;
    response_correct: number;
}