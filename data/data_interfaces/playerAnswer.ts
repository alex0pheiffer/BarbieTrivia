// player answer data
// answer_id        :   int
// user             :   string
// ask_id           :   int
// response         :   int

export interface PlayerAnswerI {
    answer_id: number;
    user: string;
    ask_id: number;
    response: number;
    submitted: number;
}