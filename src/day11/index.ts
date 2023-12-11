import run from "aocrunner";
import _ from "lodash";


interface Position
{
    y: number;
    x: number;
}

type GalaxyMap = Position[];




const expand_map = (unsorted_non_expanding:number[], expansion:number): Map<number, number> =>
{
    const non_expanding = [...unsorted_non_expanding].sort((a, b) => a - b);
    const end = non_expanding[non_expanding.length-1];
    const s = new Set(non_expanding);

    const remap = new Map<number, number>();
    let offset = 0;
    for(let i = 0; i <= end; ++i)
    {
        remap.set(i, i+offset);
        if(!s.has(i)) offset += (expansion-1);
    }
    return remap;
}



const parseInput = (rawInput: string) : GalaxyMap => {

    const positions : Position[] = [];
    rawInput.trim().split("\n").forEach((ln, y) => ln.trim().split("").forEach((v, x) => {
        if(v == "#")
        {
            positions.push({y, x});
        }
    }));

    return positions;
};

const expand = (positions:GalaxyMap, expansion:number) : GalaxyMap => 
{
    //now expand it
    const y_map = expand_map(positions.map(v => v.y), expansion);
    const x_map = expand_map(positions.map(v => v.x), expansion);
    const mapped_positions = positions.map(({y, x}) => {
        return {y: y_map.get(y)??0, x: x_map.get(x)??0}
    });
    return mapped_positions;

}

const part1 = (rawInput: string) => {
    const input = expand(parseInput(rawInput), 2);
    const distances = input.flatMap((a, idx) => input.slice(idx+1).map(b => {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }))
    const s = _.sum(distances);
    //console.log(s);
    return s;
};

const part2 = (rawInput: string) => {
    const input = expand(parseInput(rawInput), 1000000);
    const distances = input.flatMap((a, idx) => input.slice(idx+1).map(b => {
        return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y));
    }))
    const s = _.sum(distances);
    //console.log(s);
    return s;
};

run({
    part1: {
        tests: [
            {
              input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
              expected: 374,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
          ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
