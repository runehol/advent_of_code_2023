import run from "aocrunner";
import _ from "lodash";

interface Position
{
    x: number;
    y: number;
}
type Direction = Position;

const add = (p:Position, d:Direction) : Position => 
{
    return {x:p.x+d.x, y:p.y+d.y}
}
/*

    /:
    (x=0, y=1) <=> (x=-1, y=0)
    (x=0, y=-1) <=> (x=1, y=0)

    \:
    (x=0, y=1) <=> (x=1, y=0)
    (x=0, y=-1) <=> (x=-1, y=0)
*/

const reflect = (d:Direction, tile:string) : Direction[] =>
{
    const dx = d.x;
    const dy = d.y;
    switch(tile)
    {
        case '.': 
            return [d];
        case '|':
            if(dy != 0) return [d];
            return [{x:0, y:-1}, {x:0, y:1}];
        case '-':
            if(dx != 0) return [d];
            return [{x:-1, y:0}, {x:1, y:0}];
        case '/':
            return [{x:-dy, y:-dx}];
        case '\\':
            return [{x:dy, y:dx}];


        default: 
            throw "unknown tile " + tile;
    }
}

interface Ray
{
    pos:Position;
    dir:Direction;
}

const fill_map = (map:string[][], starts:Ray[]) : number =>
{
    const filled_positions = new Set<string>();

    const visited = new Set<string>();
    let rays = starts;
    while(rays.length > 0)
    {
        rays = rays.flatMap(ray => 
            {
                const tile = (map[ray.pos.y]||"")[ray.pos.x];
                if(tile === undefined) return []; //off the end

                const rk = "pos"+ray.pos.x +"," + ray.pos.y + "dir" + ray.dir.x + ","+ray.dir.y;
                if(visited.has(rk)) return []; // already been here
                visited.add(rk);
                filled_positions.add(ray.pos.x+","+ray.pos.y);
                const new_dirs = reflect(ray.dir, tile);
                return new_dirs.map(dir => {
                    
                    return {pos:add(ray.pos, dir), dir}
                })
            })
    }

    return filled_positions.size;
}

const parseInput = (rawInput: string) : string[][] => {
    return rawInput.split("\n").map(ln=>ln.split(""));
};

const fmt = (map:string[][], fills:Set<string>) : string =>
{
    
    return map.map((ln, y) => ln.map((tile, x) => 
    {
        const pos: Position = {x, y}
        const k = pos.x+","+pos.y;
        if(fills.has(k))
        {
            return '#';
        } else {
            return '.';
        }
    }).join("")).join("\n")
    
}


const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const res = fill_map(input, [{pos:{x:0, y:0}, dir:{x:1, y:0}}]);
    return res;
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const h = input.length;
    const w = input[0].length;
    const a = _.range(0, h).map(y => fill_map(input, [{pos:{x:0, y:y}, dir:{x:1, y:0}}]));
    const b = _.range(0, h).map(y => fill_map(input, [{pos:{x:w-1, y:y}, dir:{x:-1, y:0}}]));
    const c = _.range(0, w).map(x => fill_map(input, [{pos:{x:x, y:0}, dir:{x:0, y:1}}]));
    const d = _.range(0, w).map(x => fill_map(input, [{pos:{x:x, y:h-1}, dir:{x:0, y:-1}}]));
    const all_options = [].concat(a, b, c, d);
    const res = _.max(all_options);
    return res;
};

run({
    part1: {
        tests: [
            {
              input: `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
              expected: 46,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
                expected: 51,
              },
          ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
