import run from "aocrunner";
import _ from "lodash";

interface Hand
{
    bet: number;
    raw_hand: string;
}



const major_score = (cards: string, has_joker:boolean) => 
{
    const buckets = new Map<string, number>();
    let jokers = 0;
  
    cards.split("").forEach(c => buckets.set(c, (buckets.get(c)||0) + 1));
    if (has_joker) {
      jokers = buckets.get("J") || 0;
      buckets.delete("J");
    }
    const [max = 0, second = 0] = [...buckets.values()].sort((a, b) => b - a);
    return (max + jokers) * 10 + second;
}

const parseInput = (rawInput: string) : Hand[] => {
    return rawInput.split("\n").map(ln =>
        {
            const fields = ln.split(/\s+/);
            const raw_hand = fields[0];
            const bet = parseInt(fields[1]);
            return { raw_hand, bet }
        });

};

const order1 = "23456789TJQKA";
const c_to_val1 = new Map<string,number>(order1.split("").map((v, idx) => [v, idx+2]));


const score_hand = (raw_hand: string, c_to_val:Map<string,number>, has_joker:boolean) =>
{
    const values = raw_hand.split("").map(v => c_to_val.get(v)||0);

    const major = major_score(raw_hand, has_joker);
    const minor = _.sum(values.map((v, idx) => v*(100**(4-idx))))
    const score = major * 100**6 + minor;
    return score;
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const scored_input = input.map(hand =>
        {
            const raw_hand = hand.raw_hand;
            const bet = hand.bet;
            const score = score_hand(raw_hand, c_to_val1, false);
            return { raw_hand, bet, score};
        });
    const ordered = scored_input.sort((a, b) => a.score - b.score);
    const total = _.sum(ordered.map((hand, idx) => hand.bet * (idx+1)));
    return total;
};

const order2 = "J23456789TQKA";
const c_to_val2 = new Map<string,number>(order2.split("").map((v, idx) => [v, idx+1]));



const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const scored_input = input.map(hand =>
        {
            const raw_hand = hand.raw_hand;
            const bet = hand.bet;
            const score = score_hand(raw_hand, c_to_val2, true);
            return { raw_hand, bet, score};
        });
    const ordered = scored_input.sort((a, b) => a.score - b.score);
    console.log(ordered);
    const total = _.sum(ordered.map((hand, idx) => hand.bet * (idx+1)));
    return total;
};

run({
    part1: {
        tests: [
            {
              input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
              expected: 6440,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
                expected: 5905,
              },
          ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
