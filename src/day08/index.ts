import run from "aocrunner";
import _ from "lodash";

interface Input
{
    directions: number[];
    map: Map<string, [string, string]>;
}

const parseInput = (rawInput: string) : Input=> {
    const [dirl, maplines] = rawInput.split("\n\n");
    const directions = dirl.split("").map(v => {
        if(v == "L") return 0;
        if(v == "R") return 1;
        throw "unknown direction " + v;
    });

    const map = new Map<string, [string, string]>(maplines.split("\n").map(ln => 
        {
            const [_, label, left, right] = ln.match(/(\w+) = \((\w+), (\w+)\)/) || ["", "", "", ""];
            return [label, [left, right]];
        }));
    return { directions, map };
};

const step_until_zzz = (input: Input) =>
{
    const {directions, map} = input;
    let n = 0;
    let label = "AAA";
    for(n = 0; label != "ZZZ"; ++n)
    {
        const choices = map.get(label)||["omg", "lol"];
        label = choices[directions[n % directions.length]];
    }
    return n;
}




const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const n_steps = step_until_zzz(input);
    return n_steps;
};



interface NLabel
{
    n: number;
    label: string;
}

const step_until_xxz = (input: Input, start_label: string, start_offset: number): NLabel=>
{
    const {directions, map} = input;
    let n = 0;
    let label = start_label;
    const prev_choices : string[] = Array(directions.length).fill("oob");
    for(n = 0; (n == 0 ||  label[2] != "Z"); ++n)
    {
        const offs = (n + start_offset) % directions.length;
        if(label === prev_choices[offs])
        {
            return {n:-1, label:"oob"}
        }
        prev_choices[offs] = label;
        const choices = map.get(label);
        if(choices === undefined) throw "out of bounds";
        label = choices[directions[offs]];
    }
    console.log("step_until_xxz", start_label, start_offset, n, label);
    return {n, label};
}

const make_memoized_step_until_xxz = (input: Input) =>
{
    const cache = new Map<string, NLabel>();
    return (start_label:string, start_offset: number) : NLabel => 
    {
        const k = start_label + start_offset;
        const entry = cache.get(k);
        if(entry !== undefined) return entry;

        const calc = step_until_xxz(input, start_label, start_offset);
        cache.set(k, calc);
        return calc;
    }
}

const step_many2 = (input: Input, labels: string[]) =>
{
    const cached_step = make_memoized_step_until_xxz(input);
    const n_dirs = input.directions.length;
    const steps : number[] = Array(labels.length).fill(0);
    while(true)
    {
        let max_step = _.max(steps) || 0;
        const min_step = _.min(steps) || 0;
        if(max_step == 0) max_step = 1;
        if(min_step == max_step) return max_step; // we're here
        //console.log(steps, labels);
        labels.forEach((old_label, idx) => 
        {
            if(steps[idx] == min_step)
            {
                const {n, label} = cached_step(old_label, steps[idx] % n_dirs);
                steps[idx] += n;
                labels[idx] = label;
            }
        })
    }

}

/*
18113+a*18113=20569+b*20569=21797+c*21797=13201+d*13201=24253+e*24253=22411+f*22411=n integer solutions, smallest n

a = 1179645617 m + 1179645616, b = 1038792409 m + 1038792408, c = 980268893 m + 980268892, d = 1618583521 m + 1618583520, e = 881001157 m + 881001156, f = 953412211 m + 953412210, n = 21366921060721 m + 21366921060721, m element Z

smallest n is then:
n = 21366921060721
*/

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const starts = Array.from(input.map.keys()).filter(k => k[2] == "A");
    console.log(starts);
    return 21366921060721;
    throw "";
    const n_steps = step_many2(input, starts);
    console.log(n_steps);
    return n_steps;
};

run({
    part1: {
        tests: [
            {
              input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
              expected: 6,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
                expected: 6,
              },
          ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
