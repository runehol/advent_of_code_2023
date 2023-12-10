import run from "aocrunner";
import _ from "lodash";

interface Position
{
    y: number;
    x: number;
}

const make_key = (p:Position) => p.y + " " + p.x;

interface Board
{
    tiles: string[][];
    start_position: Position;
}
const parseInput = (rawInput: string) : Board => {
    const tiles = rawInput.split("\n").map(ln => ln.split(""));
    let start_position = {y:-1, x:-1};
    tiles.forEach((col, y) => col.forEach((v, x) => {
        if(v == "S")
        {
            start_position = {y, x}
        }
    }));
    return {tiles, start_position}
};

const fill_along_pipe = (tiles:string[][], fill:Map<string, number>, pos:Position, value:number) : Position[] =>
{
    if(fill.has(make_key(pos))) return []

    const {y, x} = pos;
    fill.set(make_key(pos), value);
    switch(tiles[pos.y][pos.x])
    {
        case '|':
            return [{y:y-1, x:x}, {y:y+1, x:x}];
        case '-':
            return [{y:y, x:x-1}, {y:y, x:x+1}];
        case 'L':
            return [{y:y-1, x:x}, {y:y, x:x+1}];
        case 'J':
            return [{y:y-1, x:x}, {y:y, x:x-1}];
        case '7':
            return [{y:y, x:x-1}, {y:y+1, x:x}];
        case 'F':
            return [{y:y, x:x+1}, {y:y+1, x:x}];
        case 'S':
            {
                let result : Position[] = [];
                const west = tiles[y][x-1];
                if(west == 'L' || west == '-' || west == 'F')
                {
                    result.push({y:y, x:x-1});
                }
                const east = tiles[y][x+1];
                if(east == 'J' || east == '-' || east == '7')
                {
                    result.push({y:y, x:x+1});
                }
                const north = (tiles[y-1]||"")[x];
                if(north == 'F' || north == '|' || north == '7')
                {
                    result.push({y:y-1, x:x});
                }
                const south = (tiles[y+1]||"")[x];
                if(south == 'J' || south == '|' || south == 'L')
                {
                    result.push({y:y+1, x:x});
                }

                return result;
            }
        case '.':
            return []
        case undefined:
            return [];
        default:
            throw "unknown tile";
        }
}


const flood_fill = (tiles:string[][], start_frontier:Position[], fill_step:(tiles:string[][], fill:Map<string, number>, pos:Position, value:number) => Position[]) =>
{
    const fill = new Map<string, number>()
    let frontier : Position[] = start_frontier;

    let fill_value = 0;
    while(frontier.length)
    {
        frontier = _.flatMap(frontier, (f:Position) => fill_step(tiles, fill, f, fill_value));
        fill_value++;

    }
    return fill;
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    
    const fill = _.max(Array.from(flood_fill(input.tiles, [input.start_position], fill_along_pipe).values()));
    console.log(fill);
    return fill;
};

const expand_map = (orig_map:string[][]):string[][] =>
{
    let result: string[][] = [];
    orig_map.forEach(line => 
        {
            result.push(line.flatMap(e =>
                {
                    switch(e)
                    {
                    case '|':
                        return ".█.".split("");
                    case '-':
                        return "...".split("");
                    case 'L':
                        return ".█.".split("");
                    case 'J':
                        return ".█.".split("");
                    case '7':
                        return "...".split("");
                    case 'F':
                        return "...".split("");
                    case 'S':
                        return ".█.".split("");
                    case '.':
                        return "...".split("");
                    }
                    throw "unknown tile";
                }));

                result.push(line.flatMap(e =>
                    {
                        switch(e)
                        {
                        case '|':
                            return ".█.".split("");
                        case '-':
                            return "███".split("");
                        case 'L':
                            return ".██".split("");
                        case 'J':
                            return "██.".split("");
                        case '7':
                            return "██.".split("");
                        case 'F':
                            return ".██".split("");
                        case 'S':
                            return "███".split("");
                        case '.':
                            return "...".split("");
                        }
                        throw "unknown tile";
                    }));
                    result.push(line.flatMap(e =>
                        {
                            switch(e)
                            {
                            case '|':
                                return ".█.".split("");
                            case '-':
                                return "...".split("");
                            case 'L':
                                return "...".split("");
                            case 'J':
                                return "...".split("");
                            case '7':
                                return ".█.".split("");
                            case 'F':
                                return ".█.".split("");
                            case 'S':
                                return ".█.".split("");
                            case '.':
                                return "...".split("");
                            }
                            throw "unknown tile";
                        }));
                });
    return result;
}
const fill_space = (tiles:string[][], fill:Map<string, number>, pos:Position, value:number) : Position[] =>
{
    if(fill.has(make_key(pos))) return []

    const {y, x} = pos;
    if(tiles[y] !== undefined && tiles[y][x] == '.')
    {
        fill.set(make_key(pos), value);
        return [{y:y-1, x:x}, {y:y+1, x:x}, {y:y, x:x-1}, {y:y, x:x+1}]
    }
    return [];

}
const print_fill = (tiles:string[][], fill:Map<string, number>) =>
{
    let printout = ""
    _.range(0, tiles.length).forEach(y =>
        {
            _.range(0, tiles[0].length).forEach(x =>
                {
                    const v = fill.get(make_key({y, x}));
                    let s = tiles[y][x];
                    if(s == '.' && x % 3 == 1 && y % 3 == 1) s = 'o';
                    if(v !== undefined)
                    {
                        const k = " " + v;
                        s = k[k.length-1];
                        s = " ";
                        //s = "" + v;
                    }
                    while(s.length < 4) s = " " + s;
                    printout += s;
                })
            printout += "\n";
        });
    console.log(printout);

}

const print_fill2 = (tiles:string[][], fill:Map<string, number>) =>
{
    let printout = ""
    _.range(0, tiles.length).forEach(y =>
        {
            _.range(0, tiles[0].length).forEach(x =>
                {
                    const v = fill.get(make_key({y, x}));
                    let s = tiles[y][x];
                    if(s == '.' && x % 3 == 1 && y % 3 == 1) s = 'o';
                    if(v !== undefined)
                    {
                        s = "█"
                    }
                    //while(s.length < 4) s = " " + s;
                    printout += s;
                })
            printout += "\n";
        });
    console.log(printout);

}

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);

    const loop_map = flood_fill(input.tiles, [input.start_position], fill_along_pipe);

    const filtered_tiles = input.tiles.map((ln, y) => ln.map((v, x) => loop_map.has(make_key({y, x})) ? v : '.'));

    const expanded_map = expand_map(filtered_tiles);
    let start_positions : Position[] = [];
    const h = expanded_map.length;
    const w = expanded_map[0].length;
    _.range(0, h).forEach(y => {
        start_positions.push({y, x:0})
        start_positions.push({y, x:w-1})
    })
    _.range(0, w).forEach(x => {
        start_positions.push({y:0, x});
        start_positions.push({y:h-1, x});
    })
    const fill_map = flood_fill(expanded_map, start_positions, fill_space);

    const inside_map = new Map<string, number>();
    filtered_tiles.forEach((ln, y) => ln.forEach((v, x) => {
        if(v !== '.') return 0;
        const w = fill_map.get(make_key({x:x*3+1, y:y*3+1}))
        if(w !== undefined) return 0; //reachable from outside;
        inside_map.set(make_key({y, x}), 1)
        return 1;
    }));


    const n_inside = inside_map.size;
    return n_inside;
};

run({
    part1: {
        tests: [
            {
            input: `.....
.S-7.
.|.|.
.L-J.
.....`,
            expected: 4,
            },
  
            {
              input: `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`,
              expected: 8,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
              input: `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,
              expected: 8,
            },
            {
                input: `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`,
                expected: 10,
              },
            ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
