import run from "aocrunner";
import _ from "lodash";
import { memoize } from "../utils/index.js";


const transpose = (chunk:string[][]) : string[][] =>
{
    return _.range(0, chunk[0].length).map((_, col) => (chunk.map(ln => ln[col])))
}

const reverse = (chunk:string[][]) : string[][] =>
{
    return chunk.map(ln => Array.from(ln).reverse())
}

const flip = (chunk:string[][]) : string[][] =>
{
    return transpose(reverse(chunk));
}

const parseInput = (rawInput: string) => {
    const map = rawInput.split("\n").map(ln => ln.split(""));

    return transpose(map);
};


const print = (chunk:string[][]) =>
{
    const m = transpose(chunk);
    console.log(m.map(ln=>ln.join("")).join("\n"))
    console.log()
}

const roll_left = (m: string[][]) : string[][] =>
{
    return m.map(ln => 
        {
            let new_line : string[] = Array(ln.length).fill(".");
            let roll_pos = 0;
            ln.forEach((v, pos) => 
            {
                switch(v)
                {
                    case '#':
                        new_line[pos] = '#';
                        roll_pos = pos+1;
                        break;
                    case 'O':
                        new_line[roll_pos] = 'O';
                        ++roll_pos;
                        break;
                    case '.':
                        break;
                    default:
                        throw "unknown";
                }
            });
            return new_line;

        })
}

const score = (m:string[][]) : number => 
{
    return _.sum(m.flatMap(ln => ln.map((v, pos) =>
    {
        if(v == 'O') return ln.length - pos;
        return 0;
    })));
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    return score(roll_left(input));
};

const cycle = (m:string[][]) : string[][] =>
{
    for(let dir = 0; dir < 4; ++dir)
    {
        m = flip(roll_left(m));
    }
    return m;
};

const mega_cycle = memoize((m:string[][], steps:number) : string[][] =>
{
    if(steps == 1) return cycle(m);
    if(steps % 10 != 0) throw "";
    const smaller_step = steps / 10;
    for(let i = 0; i < 10; ++i)
    {
        m = mega_cycle(m, smaller_step);
    }
    return m;
});

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const n_cycles = 1000000000;
    let m = mega_cycle(input, n_cycles);
    const res = score(m);
    console.log(res);
    return res;
};

run({
    part1: {
        tests: [
            {
              input: `OOOO.#.O..
OO..#....#
OO..O##..O
O..#.OO...
........#.
..#....#.#
..O..#.O.O
..O.......
#....###..
#....#....`,
              expected: 136,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `OOOO.#.O..
OO..#....#
OO..O##..O
O..#.OO...
........#.
..#....#.#
..O..#.O.O
..O.......
#....###..
#....#....`,
                expected: 64,
              },
          ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
