import run from "aocrunner";
import _ from "lodash";

interface Range
{
    min: number;
    max: number;
}

interface Entry
{
    src: Range;
    diff: number;
}

interface Mapping
{
    map: Entry[];
}

interface Input
{
    seeds: number[];
    ranges: Range[];
    mappings: Mapping[];
}
const parseInput = (rawInput: string) : Input => {
    const all_sections = rawInput.split("\n\n");

    const seeds = all_sections[0].split("seeds: ")[1].split(" ").map(e => parseInt(e));
    const map_sections = all_sections.slice(1);
    const mappings = map_sections.map(m =>
        {
            const map = m.split(":\n")[1].split("\n").map(ln =>
                {
                    const entries = ln.split(" ").map(e => parseInt(e));
                    const dst_min = entries[0];
                    const src_min = entries[1];
                    const n = entries[2];
                    const src_max = src_min + n - 1;
                    const diff = dst_min - src_min;
                    return {src:{min:src_min, max:src_max}, diff};
                })
            return {map};
        }
    )
    const ranges: Range[] = [];
    for(let i = 0; i < seeds.length; i += 2)
    {
        const start = seeds[i];
        const n = seeds[i+1];
        ranges.push({min:start, max:start+n-1});
    }

    return {seeds, ranges, mappings};
};

const remap = (src: number, mapping: Mapping) : number =>
{
    for(const e of mapping.map)
    {
        if(src >= e.src.min && src <= e.src.max)
        {
            const dst = src + e.diff;
            return dst;
        }
    };
    return src;
}

const full_remap = (a: number, mappings: Mapping[]) : number =>
{
    return mappings.reduce((acc, m) => remap(acc, m), a);
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const translated = input.seeds.map(s => full_remap(s, input.mappings));
    const result = _.min(translated);
    return result;
};

interface PartiallyRemapped
{
    left: Range[];
    translated: Range[];
}

const remap_with_entry = (pr: PartiallyRemapped, e: Entry) : PartiallyRemapped =>
{
    const left: Range[] = [];
    const translated: Range[] = pr.translated.slice();
    pr.left.forEach(s =>
        {
            const e1 = {min:s.min, max: Math.min(s.max, e.src.min-1)};
            if(e1.min <= e1.max)
            {
                left.push(e1);
            }
            const e2 = {min:Math.max(s.min, e.src.min)+e.diff, max:Math.min(s.max, e.src.max)+e.diff}
            if(e2.min <= e2.max)
            {
                translated.push(e2)
            }
            const e3 = {min:Math.max(s.min, e.src.max+1), max:s.max}
            if(e3.min <= e3.max)
            {
                left.push(e3);
            }
        })

    return { left, translated };
}

const remap_with_map = (ranges: Range[], m: Mapping) : Range[] =>
{
    const init : PartiallyRemapped = {left: ranges, translated: []};
    const pr = m.map.reduce(remap_with_entry, init);
    return [...pr.translated, ...pr.left];
}

const full_remap2 = (ranges: Range[], mappings: Mapping[]) : Range[] =>
{
    return mappings.reduce(remap_with_map, ranges);
}

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const translated = full_remap2(input.ranges, input.mappings);
    const result = _.min(translated.map(r => r.min))
    return result;
};

run({
    part1: {
        tests: [
            {
                input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
           expected: 35,
             },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
           expected: 46,
             },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
