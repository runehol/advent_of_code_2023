import run from "aocrunner";
import { a_star } from "../utils/index.js";
import _ from "lodash";


interface Board
{
    map: number[][];
    width: number;
    height: number;
}



interface Position
{
    x: number;
    y: number;
    direction: number; // 0-3
    n_steps_in_direction: number; //0 - 3
}

const find_route = (b: Board, find_neighbours: (p:Position) => Position[]) : Position[] =>
{
    
    const infinity = 1<<30;

    const to_key = (p:Position) : string => "x: " + p.x + "y: " + p.y + "dir: " + p.direction + "n_steps: " + p.n_steps_in_direction;

    
    const manhattan_distance_xy_only = (a:Position, b:Position) => 
    {
        return Math.abs(b.y - a.y) + Math.abs(b.x - a.x);
    }

    const start : Position = 
    {
        x: 0,
        y: 0,
        direction: 0,
        n_steps_in_direction: 0
    }

    const end : Position = 
    {
        x: b.width-1,
        y: b.height-1,
        direction: 0,
        n_steps_in_direction: 0
    }

    const h = (pos:Position) =>
    {
        return manhattan_distance_xy_only(pos, end)
    }


    const d = (from: Position, to: Position) =>
    {

        //not the start and end positions, the only ones allowed outside the main board
        if(to.y < 0 || to.y >= b.height) return infinity;
        if(to.x < 0 || to.x >= b.width) return infinity;
        //assumes we'll only be called for neighbouring positions
        let cost = b.map[to.y][to.x];
        return cost;
    }


    const is_equal = (a:Position, b:Position) =>
    {
        return a.x == b.x && a.y == b.y;
    }

    const path =  a_star<Position>([start], end, h, d, find_neighbours, is_equal, to_key);
    return path;

}


const parseInput = (rawInput: string) : Board => {
    const map = rawInput.split("\n").map(ln => ln.split("").map(v => parseInt(v)));
    const height = map.length;
    const width = map[0].length;
    return {map, height, width}
};

const print = (b:Board, path:Position[]) =>
{
    const trunc_path = path.slice(1);
    const m = b.map.map((ln, y) => ln.map((v, x) => 
    {
        let symbol = " ";
        trunc_path.forEach(p =>
        {
            if(p.x == x && p.y == y)
            {
                symbol = '>v<^'[p.direction];
            }
        });
        return v + symbol + " ";
    }).join("")).join("\n");
    console.log(m);
}

const dirs = [
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x:-1, y: 0},
    {x: 0, y:-1}
]


const part1 = (rawInput: string) => {

    const find_neighbours = (p:Position) : Position[] =>
    {
        let new_positions : Position[] = [];
        [3, 0, 1].forEach(delta_dir => 
            {
                const direction = (p.direction + delta_dir) % 4;
                if(direction == p.direction && p.n_steps_in_direction >= 3) return;
                const x = p.x + dirs[direction].x;
                const y = p.y + dirs[direction].y;
                const n_steps_in_direction = direction == p.direction ? p.n_steps_in_direction + 1 : 1;
                const n : Position = {x, y, direction, n_steps_in_direction};
                new_positions.push(n);
            })

        return new_positions;
    }

    const b = parseInput(rawInput);
    const path = find_route(b, find_neighbours);
    const cost = _.sum(path.slice(1).map(p => b.map[p.y][p.x]));
    console.log(cost);
    return cost;
};

const part2 = (rawInput: string) => {
    const find_neighbours = (p:Position) : Position[] =>
    {
        let new_positions : Position[] = [];
        [3, 0, 1].forEach(delta_dir => 
            {
                const direction = (p.direction + delta_dir) % 4;
                if(direction == p.direction && p.n_steps_in_direction >= 10) return;
                if(direction != p.direction && p.n_steps_in_direction < 4) return;
                const x = p.x + dirs[direction].x;
                const y = p.y + dirs[direction].y;
                const n_steps_in_direction = direction == p.direction ? p.n_steps_in_direction + 1 : 1;
                const n : Position = {x, y, direction, n_steps_in_direction};
                new_positions.push(n);
            })

        return new_positions;
    }

    const b = parseInput(rawInput);
    const path = find_route(b, find_neighbours);
    const cost = _.sum(path.slice(1).map(p => b.map[p.y][p.x]));
    console.log(cost);
    return cost;
};

run({
    part1: {
        tests: [
            {
              input: `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`,
              expected: 102
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
