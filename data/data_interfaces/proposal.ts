// question data
// proposal_id      :   int
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
// submitted        :   int (if the prompt has been officially sent)

export interface ProposalI {
    proposal_id: number;
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
    submitted: number;
    accepted: number;
    declined: number;
    message_id: string;
}