import run from "aocrunner";
import _ from "lodash";
import { memoize } from "../utils/index.js";

interface Row
{
    records: string;
    spans: number[];
}

const parseInput = (rawInput: string) : Row[] => {
    return rawInput.trim().split("\n").map(ln =>
        {
            const [records, sp] = ln.trim().split(" ");
            const spans = sp.split(",").map(v => parseInt(v));
            return { records, spans}
            
        });
    };

const count_arrangements = memoize((records: string, spans: number[]): number => {
    if (records.length === 0) {
        if (spans.length === 0) {
            return 1;
        }
        return 0;
    }
    if (spans.length === 0) {
        for (let i = 0; i < records.length; i++) {
            if (records[i] === "#") {
                return 0;
            }
        }
        return 1;
    }

    if (records.length < _.sum(spans) + spans.length - 1) {
        // cutoff: not long enough for the rest of the spans
        return 0;
    }

    if (records[0] === ".") {
        return count_arrangements(records.slice(1), spans);
    }
    if (records[0] === "#") {
        const [first_span, ...rest_spans] = spans;
        for (let i = 0; i < first_span; i++) {
            if (records[i] === ".") {
                return 0;
            }
        }
        if (records[first_span] === "#") {
            return 0;
        }
        
        return count_arrangements(records.slice(first_span + 1), rest_spans);
    }
    // We have a wildcard in the first spot, try both ways
    return (
        count_arrangements("#" + records.slice(1), spans) + count_arrangements("." + records.slice(1), spans)
        );
});

            
            
const part1 = (rawInput: string) => {
const input = parseInput(rawInput);
const n_arrangements = input.map(r => count_arrangements(r.records, r.spans));
const result = _.sum(n_arrangements);
console.log(result);
return result;
};

const unfold = (row:Row) : Row =>
{
const {records, spans} = row;
return {
    records: records + '?' + records + '?' + records + '?' + records + '?' + records,
    spans: [...spans, ...spans, ...spans, ...spans, ...spans]
}
}


const part2 = (rawInput: string) => {
const input_ = parseInput(rawInput);
const input = input_.map(unfold);
const n_arrangements = input.map(r => 
    {
        const n = count_arrangements(r.records, r.spans);
        return n;
    });
    const result = _.sum(n_arrangements);
    return result;
};

run({
    part1: {
        tests: [
            {
                input: `#.#.### 1,1,3
                .#...#....###. 1,1,3
                .#.###.#.###### 1,3,1,6
                ####.#...#... 4,1,1
                #....######..#####. 1,6,5
                .###.##....# 3,2,1`,
                expected: 6,
            },
            {
                input: `???.### 1,1,3
                .??..??...?##. 1,1,3
                ?#?#?#?#?#?#?#? 1,3,1,6
                ????.#...#... 4,1,1
                ????.######..#####. 1,6,5
                ?###???????? 3,2,1`,
                expected: 21,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `???.### 1,1,3
                .??..??...?##. 1,1,3
                ?#?#?#?#?#?#?#? 1,3,1,6
                ????.#...#... 4,1,1
                ????.######..#####. 1,6,5
                ?###???????? 3,2,1`,
                expected: 525152,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
