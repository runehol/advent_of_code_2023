import run from "aocrunner";
import { head } from "lodash";

interface Position
{
    x: number;
    y: number;
}

const to_key = (p:Position) => p.x + ","+p.y;

const manhattan_distance = (a:Position, b:Position) => Math.abs(a.x-b.x) + Math.abs(a.y-b.y)

const eq = (a:Position, b:Position) => a.x == b.x && a.y == b.y;

interface Board
{
    map: string[];
    height: number;
    width: number;
    start: Position;
    end: Position;
}

const parseInput = (rawInput: string) : Board => {
    const map = rawInput.split("\n");
    const height = map.length;
    const width = map[0].length;
    const start = {x: 1, y: 0};
    const end = {x:width-2, y: height-1};
    return {map, width, height, start, end};
};

const dirs = [
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x:-1, y: 0},
    {x: 0, y:-1}
]

const print = (b:Board, path:Map<string, number>) =>
{
    const str = b.map.map((ln, y) => ln.split("").map((t, x) =>
    {
        if(path.has(to_key({x, y})))
        {
            return "O";
        }
        return t;
    }).join("")).join("\n");
    console.log(str);
    console.log("")
}

const route = (b:Board, p:Position, steps_so_far:Map<string, number>, not_slippery:boolean) : Map<string, number>|undefined =>
{
    // see if we're there
    if(eq(p, b.end)) return steps_so_far;

    let candidates : Position[] = [];
    for(const d of dirs)
    {
        const p2 = {x:p.x+d.x, y:p.y+d.y};
        if(!steps_so_far.has(to_key(p2)))
        {
            const tile = (b.map[p2.y]??"")[p2.x];
            switch(tile)
            {
            case '.':
                //valid
                candidates.push(p2);
                break;
            case '>':
                if(not_slippery || d.x == 1) candidates.push(p2);
                break;
            case '<':
                if(not_slippery || d.x == -1) candidates.push(p2);
                break;
            case 'v':
                if(not_slippery || d.y == 1) candidates.push(p2);
                break;
            case '^':
                if(not_slippery || d.y == -1) candidates.push(p2);
                break;
            }
        }
    }

    let longest_candidate:Map<string, number>|undefined = undefined;
    let len = 0;
    for(const c of candidates)
    {
        let next_so_far = steps_so_far;
        if(candidates.length > 1) next_so_far = new Map<string, number>(next_so_far);
        next_so_far.set(to_key(c), steps_so_far.size);
        const res = route(b, c, next_so_far, not_slippery);
        if(res !== undefined)
        {
            if(res.size > len)
            {
                longest_candidate = res;
                len = res.size;
            }
        }
    }
    return longest_candidate;
}




const part1 = (rawInput: string) => {
    const b = parseInput(rawInput);
    const res = route(b, b.start, new Map<string, number>, false);
    let n = -1;
    if(res !== undefined)
    {
        n = res.size;
    }
    console.log("Part 1:", n);
    return n;
};

const part2 = (rawInput: string) => {
    const b = parseInput(rawInput);
    const res = route(b, b.start, new Map<string, number>, true);
    let n = -1;
    if(res !== undefined)
    {
        n = res.size;
    }
    console.log("Part 2:", n);
    return n;
};

run({
    part1: {
        tests: [
            {
                input: `#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`,
                expected: 94,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`,
                expected: 154,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
