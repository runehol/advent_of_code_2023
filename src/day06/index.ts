import run from "aocrunner";
import _ from "lodash";

interface Race
{
    time: number;
    distance: number;
}

const parseInput = (rawInput: string) : Race[] => {
    const ins = rawInput.split("\n").map(ln => ln.split(/:\s*/)[1].split(/\s+/).map(v => parseInt(v)))
    return _.zip(ins[0], ins[1]).map(td =>
        {
            const time = td[0]||0;
            const distance = td[1]||0;
            return {time, distance}
        })
};



//distance formula for part 1
// speed = x
// distance = speed*(time-x)
// distance = x*(time-x)
// distance = x * time - x**2

// distance over record:
// over = x * time - x**2 - record


// 0 = -x**2 + x*t - record
// a = -1, b = t, c = -record

// now we use (-b +/- sqrt(b^2 - 4ac))/2a

const n_solutions = (race:Race) =>
{
    const a = -1;
    const b = race.time;
    const c = -race.distance;

    const rt = Math.sqrt(b**2 - 4*a*c);
    const low = (-b+rt)/(2*a);
    const hi = (-b-rt)/(2*a);
    const eps = 1e-7;
    const first_solution = Math.ceil(low+eps);
    const last_solution = Math.floor(hi-eps);
    return last_solution-first_solution+1;
}


const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const sols = input.map(n_solutions);
    return sols.reduce((p, s) => p*s, 1);
};

const part2 = (rawInput: string) => {
    const in2 = rawInput.replace(/ +/g, "");

    const input = parseInput(in2);
    const sols = input.map(n_solutions);
    return sols.reduce((p, s) => p*s, 1);
};

run({
    part1: {
        tests: [
            {
              input: `Time:      7  15   30
Distance:  9  40  200`,
              expected: 288,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `Time:      7  15   30
  Distance:  9  40  200`,
                expected: 71503,
              },
          ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
