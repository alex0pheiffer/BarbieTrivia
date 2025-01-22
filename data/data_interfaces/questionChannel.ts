// question channel data
// qch_id           :   int
// server           :   20char str
// channel          :   20char str
// owner            :   20char str
// date             :   bigint (time in ms)
// question         :   int (number of questions asked)

export interface QuestionChannelI {
    qch_id: number;
    server: string | null;
    channel: string;
    owner: string;
    date: number;
    question: number;
}