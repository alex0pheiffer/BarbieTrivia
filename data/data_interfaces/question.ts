// question data
// question_id      :   int
// question         :   500char str
// image            :   500char str
// ans_a            :   200char str
// ans_b            :   200char str
// ans_c            :   200char str
// ans_d            :   200char str
// d_always_last    :   int
// fun_fact         :   500char str
// correct          :   int     (0==a, 1==b, 2==c, 3==d)
// date             :   bigint (time in ms)
// submitter        :   20char str
// response_total   :   int (total number of responses)
// response_correct :   int (total number of correct responses)
// shown_total      :   int (show many times this was sent into a channel)

export interface QuestionI {
    question_id: number;
    question: string;
    image: string;
    ans_a: string;
    ans_b: string;
    ans_c: string;
    ans_d: string;
    d_always_last: number;
    fun_fact: string;
    correct: number;
    date: number;
    submitter: string;
    response_total: number;
    response_correct: number;
    shown_total: number;
}