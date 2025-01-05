// asked question data
// ask_id           :   int
// qch_id           :   int
// question_id      :   int
// date             :   bigint (time in ms)
// response_total   :   int (total number of responses)
// response_correct :   int (total number of correct responses)
// active           :   int (if the question is currently active)
// ans_a            :   int (shuffled. this number == the original index)
// ans_b            :   int (shuffled. this number == the original index)
// ans_c            :   int (shuffled. this number == the original index)
// ans_d            :   int (shuffled. this number == the original index)
// max_img          :   int (the index of the maximus image)

export interface AskedQuestionI {
    ask_id: number;
    channel_id: string;
    question_id: number;
    date: number;
    response_total: number;
    response_correct: number;
    active: number;
    ans_a: number;
    ans_b: number;
    ans_c: number;
    ans_d: number;
    max_img: number;
    message_id: string;
    next_question_time: number;
}