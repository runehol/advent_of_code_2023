import run from "aocrunner";
import _ from 'lodash';

interface Card 
{
    id: number;
    winning: number[];
    our: number[];
    n_wins: number;
}

const parseInput = (rawInput: string) : Card[] => {
    return rawInput.split("\n").map(line =>
        {
            const m = line.match(/Card\s+(\d+):\s+(.*) \| (.*)/)
            if(m === null) throw "blah";
            const id = parseInt(m[1]);
            const winning = m[2].split(/\s+/).map(n => parseInt(n));
            const our = m[3].split(/\s+/).map(n => parseInt(n));
            const n_wins = our.filter(x => winning.includes(x)).length
            return {id, winning, our, n_wins};
        });
};

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const wins = input.map(card => 
        {
            if(card.n_wins == 0) return 0;
            return 1<<(card.n_wins-1);
        });
    const s =  _.sum(wins);
    return s;
};


const score = (cards:Card[]) =>
{
    const card_wins = new Map<number, number>();
    cards.forEach(card => 
        {
            card_wins.set(card.id, card.n_wins);
        });
    
    let total_cards = 0;

    let card_counts = [0].concat(Array<number>(cards.length).fill(1));
    for(let id = 1; id < card_counts.length; ++id)
    {
        const n_cards = card_counts[id];
        const n_wins = card_wins.get(id)||0;
        for(let c = id+1; c <= id+n_wins; ++c)
        {
            card_counts[c] += n_cards;
        }
    }
    return _.sum(card_counts);

}


const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    return score(input);
};

run({
    part1: {
        tests: [
            {
              input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
              expected: 13,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
  Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
  Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
  Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
  Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
  Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
                expected: 30,
              },
          ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
