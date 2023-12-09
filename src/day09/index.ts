import run from "aocrunner";
import _, { reverse } from "lodash";

const parseInput = (rawInput: string) : number[][] => {
    return rawInput.split("\n").map(ln => ln.split(" ").map(v => parseInt(v)))
};

const predict = (values: number[]) : number =>
{
    if(_.find(values) === undefined)
    {
        // all zeros, return zero
        return 0;
    }
    //otherwise, find differences
    const differences = values.slice(1).map((curr, idx) => curr - values[idx])
    return predict(differences) + values[values.length-1];
}


const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const predictions = input.map(predict);
    const s = _.sum(predictions);
    
    return s;
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const predictions = input.map(arr => Array(...arr).reverse()).map(predict);
    const s = _.sum(predictions);
    return s;
};

run({
    part1: {
        tests: [
            // {
            //   input: ``,
            //   expected: "",
            // },
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
