import run from "aocrunner";
import _ from "lodash";

interface Instruction
{
    direction: string;
    length: number;
    colour: string;
}

const parseInput = (rawInput: string) : Instruction[] => {
    return rawInput.split("\n").map(ln =>
        {
            const [direction, len, colour] = ln.split(" ");
            const length = parseInt(len);
            return {direction, length, colour};
        });
};

interface Position
{
    x: number;
    y: number;
}



const dirs = new Map<string, Position>([
    ["L", {x:-1, y: 0}],
    ["R", {x:+1, y: 0}],
    ["U", {x: 0, y:-1}],
    ["D", {x: 0, y:+1}],
])

const instructions_to_edges = (instructions: Instruction[]) : Position[] =>
{
    let pos = {x:0, y:0};
    let edges = [pos];
    instructions.forEach(instr => 
        {
            const d = dirs.get(instr.direction);
            if(d === undefined) throw ""
            pos = {x:pos.x + d.x * instr.length, y: pos.y + d.y * instr.length };
            edges.push(pos);
        });
    return edges;

}

const area = (edges:Position[]) : number =>
{
    // use the trapezoid formula
    const s = _.sum(_.range(1, edges.length).map(i => {
        return (edges[i-1].y + edges[i].y) * (edges[i-1].x - edges[i].x)
    }))

    const inside = Math.abs(s/2);

    const edge_lengths = _.sum(_.range(1, edges.length).map(i => {
        return Math.abs(edges[i-1].y - edges[i].y) + Math.abs(edges[i-1].x - edges[i].x)
    }))
    return inside + edge_lengths/2+1;
}


const adjust_instructions = (instrs:Instruction[]) => 
{
    let directions = ["R", "D", "L", "U"]
    return instrs.map(instr => 
        {
            const code = instr.colour;
            const d = parseInt(code[7]);
            const length = parseInt(code.slice(2, 7), 16);
            const direction = directions[d];
            return {direction, length, colour:instr.colour}
        })
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const edges = instructions_to_edges(input);
    const a = area(edges);
    
    return a;
};


const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const instructions = adjust_instructions(input);
    const edges = instructions_to_edges(instructions);
    const a = area(edges);
    return a;
};

run({
    part1: {
        tests: [
            {
                input: `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`,
                expected: 62,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`,
                expected: 952408144115,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
