import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) : string[][] => {
    return rawInput.split("\n\n").map(chunk => chunk.split("\n"));
};

const transpose = (chunk:string[]) : string[] =>
{
    return _.range(0, chunk[0].length).map((_, col) => (chunk.map(ln => ln[col]).join("")))
}

const mirror_pos = (chunk:string[]) : number|undefined =>
{
    let sum = 0;
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
            sum += ref;
        }
    }
    return sum;
}

//ref = 4     |
// i = 0 1 2 3 4 5 6
// p = 7 6 5 4 

const score_map = (map:string[]): number =>
{
    let score = 0;
    const hor = mirror_pos(map);
    const vert = mirror_pos(transpose(map));
    if(vert !== undefined) score += vert;
    //if(score != 0) return score;
    if(hor !== undefined) score += 100*hor;
    //console.log(map.join("\n"))
    //console.log("")
    //console.log(transpose(map).join("\n"))
    //console.log("\n\n")
    /*console.log(map);
    console.log("hor", hor)
    console.log("vert", vert)*/
    return score;
}

const part1 = (rawInput: string) => {

    const input = parseInput(rawInput);
    const res = _.sum(input.map(score_map));
    console.log(res);
    //throw ""
    return res;
};

const part2 = (rawInput: string) => {
    
    const input = parseInput(rawInput);
    
    return;
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
            // {
            //   input: ``,
            //   expected: "",
            // },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
