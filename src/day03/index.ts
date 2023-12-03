import run from "aocrunner";

const make_key = (row:number, col:number) => row + "," + col;

interface Part
{
    symbol: string;
    part_number: number;
}

const parseInput1 = (rawInput: string) => {
    const lines = rawInput.split("\n");

    const symbols = new Map<string, string>();
    lines.forEach((line, row) =>
    {
        let symbol = /[^\d^\.]/g;
        for(let m of line.matchAll(symbol))
        {
            const column = m.index || 0;
            const part_symbol = m[0];
            symbols.set(make_key(row, column), part_symbol);
        }
    });

    let parts : Part[] = [];
    lines.forEach((line, row) =>
    {
        let number = /\d+/g;
        for(let m of line.matchAll(number))
        {
            const col = m.index || 0;
            const s = m[0];
            const part_number = parseInt(s);
            let symbol : string|undefined = undefined;
            for(let r = row-1; r <= row+1; ++r)
            {
                for(let c = col-1; c <= col+s.length; ++c)
                {
                    const sym = symbols.get(make_key(r, c));
                    if(sym !== undefined)
                    {
                        symbol = sym;
                    }
                }
            }
            if(symbol !== undefined)
            {
                parts.push({
                    symbol, part_number
                })
            }

        }
    });

    return parts;

};

const part1 = (rawInput: string) => {
    const input = parseInput1(rawInput);
    const sum =  input.reduce((acc:number, sym:Part) => acc + sym.part_number, 0);
    return sum;
};


const parseInput2 = (rawInput: string) => {
    const lines = rawInput.split("\n");

    const numbers = new Map<string, number>();
    lines.forEach((line, row) =>
    {
        let number = /\d+/g;
        for(let m of line.matchAll(number))
        {
            const col = m.index || 0;
            const s = m[0];
            const part_number = parseInt(s);
            let symbol : string|undefined = undefined;
            for(let c = col; c < col+s.length; ++c)
            {
                numbers.set(make_key(row, c), part_number);
            }
        }
    });

    let gears : number[] = [];
    lines.forEach((line, row) =>
    {
        let gear = /\*/g;
        for(let m of line.matchAll(gear))
        {
            const column = m.index || 0;
            let part_numbers = new Set<number>();
            for(let r = row-1; r <= row+1; ++r)
            {
                for(let c = column-1; c <= column+1; ++c)
                {
                    const part_number = numbers.get(make_key(r, c));
                    if(part_number !== undefined)
                    {
                        part_numbers.add(part_number);
                    }
                }
            }
            if(part_numbers.size == 2)
            {
                const nums = [...part_numbers];
                gears.push(nums[0] * nums[1]);
            }            
        }
    });


    return gears;

};


const part2 = (rawInput: string) => {
    const input = parseInput2(rawInput);
    const sum = input.reduce((acc:number, v) => acc + v, 0);
    return sum;
};

run({
    part1: {
        tests: [
            {
                input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
                expected: 4361,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
                expected: 467835,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
