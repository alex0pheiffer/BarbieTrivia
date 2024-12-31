// asked question data
// ask_id           :   int
// qch_id           :   int
// question_id      :   int
// date             :   bigint (time in ms)
// response_total   :   int (total number of responses)
// response_correct :   int (total number of correct responses)
// active           :   int (if the question is currently active)

export interface AskedQuestionI {
    ask_id: number;
    channel_id: string;
    question_id: number;
    date: number;
    response_total: number;
    response_correct: number;
    active: number;
}