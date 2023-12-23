import run from "aocrunner";
import { camelCase, head } from "lodash";
import path from "path";

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

interface Entry
{
    p:Position;
    steps_so_far:Map<string, number>;
}

const route = (b:Board, not_slippery:boolean) : number =>
{
    let longest_candidate = -1;
    let stack : Entry[] = [{p:b.start, steps_so_far:new Map<string, number>()}];
    let n_iters = 0;
    while(stack.length)
    {
        const e = stack.pop();
        if(e === undefined) throw "";
        const {p, steps_so_far} = e;
        // see if we're there
        ++n_iters;

        if(eq(p, b.end))
        {
            if(steps_so_far.size > longest_candidate) console.log("New path:", steps_so_far.size)
            longest_candidate = Math.max(longest_candidate, steps_so_far.size)
        } else {
            if(0 && not_slippery)
            {
                if(n_iters % 1000 == 0)
                {
                    console.log(longest_candidate, p);
                    print(b, steps_so_far);
                }
            }
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
            for(const c of candidates)
            {
                let next_so_far = steps_so_far;
                if(candidates.length > 1) next_so_far = new Map<string, number>(next_so_far);
                next_so_far.set(to_key(c), steps_so_far.size);
                stack.push({p:c, steps_so_far:next_so_far});
            }
        }
    }
    return longest_candidate;
}





interface Edge
{
    cost: number;
    target_name:string;
    target_position:Position;
    target?: Node;
}

interface Node
{
    name:string;
    position:Position;
    edges: Edge[];
}

interface Graph
{
    nodes: Map<string, Node>;
}

const find_candidates = (b:Board, p:Position, not_slippery:boolean) : Position[]=>
{
    let candidates : Position[] = [];
    for(const d of dirs)
    {
        const p2 = {x:p.x+d.x, y:p.y+d.y};
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
    return candidates;
}
const extract_edge_along = (b:Board, p:Position, came_from:Position, not_slippery:boolean) : Edge =>
{
    let cost = 1;
    while(1)
    {
        const c = find_candidates(b, p, not_slippery).filter(p2 => !eq(p2, came_from));
        if(c.length != 1)
        {
            return {cost, target_name:to_key(p), target_position:p}
        }
        came_from = p;
        p = c[0];
        ++cost;
    }
    throw "";
}

const extract_edges = (b:Board, start:Position, not_slippery:boolean) =>
{
    return find_candidates(b, start, not_slippery).map(p => extract_edge_along(b, p, start, not_slippery));
}

const extract_graph = (b:Board, not_slippery:boolean) : Graph =>
{
    let to_process : Position[] = [b.start]
    let nodes = new Map<string, Node>()
    while(to_process.length)
    {
        const p = to_process.pop();
        if(p === undefined) throw "";
        const name = to_key(p);
        if(!nodes.has(name))
        {
            const edges = extract_edges(b, p, not_slippery);
            const n : Node = {
                name,
                position:p,
                edges
            }
            nodes.set(name, n)

            edges.forEach(e => to_process.push(e.target_position))
        }
    }
    // fill in the target nodes
    nodes.forEach(n => n.edges.forEach(e => e.target = nodes.get(e.target_name)));
    return { nodes };
}

interface QueueEntry
{
    n: Node;
    steps_so_far:Set<string>;
    path_length: number
}

const route_graph = (g:Graph, start:Node, end:Node) : number =>
{
    let longest_candidate = -1;
    let stack : QueueEntry[] = [{n:start, steps_so_far:new Set<string>(), path_length:0}];
    let n_iters = 0;
    while(stack.length)
    {
        const element = stack.pop();
        if(element === undefined) throw "";
        const {n, steps_so_far, path_length} = element;
        // see if we're there
        ++n_iters;

        if(n.name == end.name)
        {
            longest_candidate = Math.max(longest_candidate, path_length)
        } else {
            let candidates = n.edges.filter(e => !steps_so_far.has(e.target_name));
            for(const e of candidates)
            {
                let next_so_far = steps_so_far;
                if(candidates.length > 1) next_so_far = new Set<string>(next_so_far);
                next_so_far.add(e.target_name);
                if(e.target === undefined) throw "";
                stack.push({n:e.target, steps_so_far:next_so_far, path_length:path_length+e.cost});
            }
        }
    }
    return longest_candidate;
}

const part1 = (rawInput: string) => {
    const b = parseInput(rawInput);
    const g = extract_graph(b, false);
    const start = g.nodes.get(to_key(b.start));
    const end = g.nodes.get(to_key(b.end));
    if(start === undefined || end === undefined) throw "" ;
    const n = route_graph(g, start, end);
    return n;
};

const part2 = (rawInput: string) => {
    const b = parseInput(rawInput);
    const g = extract_graph(b, true);
    const start = g.nodes.get(to_key(b.start));
    const end = g.nodes.get(to_key(b.end));
    if(start === undefined || end === undefined) throw "" ;
    const n = route_graph(g, start, end);
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
