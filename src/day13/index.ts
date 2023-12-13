import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) : string[][] => {
    return rawInput.split("\n\n").map(chunk => chunk.split("\n"));
};

const transpose = (chunk:string[]) : string[] =>
{
    return _.range(0, chunk[0].length).map((_, col) => (chunk.map(ln => ln[col]).join("")))
}

const mirror_pos = (chunk:string[], scale: number) : number[] =>
{
    let result : number[] = [];
    for(let ref = 1; ref < chunk.length; ++ref)
    {
        let is_reflected = true;
        for(let i = 0; i < ref; ++i)
        {
            const p = i + 2*(ref - i) - 1;
            if(chunk[p] !== undefined)
            {
                if(chunk[i] != chunk[p]) is_reflected = false;
            }
        }
        if(is_reflected)
        { 
            result.push(ref*scale)
        }
    }
    return result;
}

const score_map = (map:string[]): number[] =>
{
    const hor = mirror_pos(map, 100);
    const vert = mirror_pos(transpose(map), 1);
    return [...hor, ...vert];
}

const part1 = (rawInput: string) => {

    const input = parseInput(rawInput);
    const res = _.sum(input.flatMap(score_map));
    return res;
};

const flip = (chunk:string[], row:number, col:number) => 
{
    return chunk.map((ln, r) => {
        if(row != r) return ln;
        return ln.split("").map((v, c) =>
        {
            if(c != col) return v;
            if(v == '#') return '.';
            if(v == '.') return '#';
            throw "";
        }).join("")
    });
}

const all_flips = (chunk:string[]) : string[][] =>
{
    let result : string[][] = [];
    for(let r = 0; r < chunk.length; ++r)
    {
        for(let c = 0; c < chunk[0].length; ++c)
        {
            result.push(flip(chunk, r, c));
        }
    }
    return result;
}

const score2 = (chunk:string[]) : number[] =>
{
    const orig_score = score_map(chunk);
    if(orig_score.length != 1) throw "wrong length"
    const orig = orig_score[0]
    for(let r = 0; r < chunk.length; ++r)
    {
        for(let c = 0; c < chunk[0].length; ++c)
        {
            const nc = flip(chunk, r, c);
            const s = score_map(nc);
            const filt_score = s.filter(v => v != orig);
            if(filt_score.length > 0)
            {
                return filt_score;  
            } 
        }
    }
    throw "amiga";
}

const part2 = (rawInput: string) => {
    
    const input = parseInput(rawInput);
    const res = _.sum(input.flatMap(score2));
    return res;
};


run({
    part1: {
        tests: [
            {
              input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
              expected: 405,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
                expected: 400,
              },
          ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
