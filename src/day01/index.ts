import run from "aocrunner";
import _ from 'lodash';

const parseInput = (rawInput: string) => 
{
    return rawInput.split("\n").map((ln:string) => {
        const digits = ln.split("").filter(value => value >= "0" && value <= "9").map(d => parseInt(d));
        return [digits[0], digits[digits.length-1]];
    });
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const result = input.reduce((acc:number, currval:number[]) => acc + currval[0]*10 + currval[1], 0);
    return result;
};


const words_to_numbers = (input:string) => {
    const re_to_number: [RegExp, string][] = [
        [/one/g, "one1one"],
        [/two/g, "two2two"],
        [/three/g, "three3three"],
        [/four/g, "four4four"],
        [/five/g, "five5five"],
        [/six/g, "six6six"],
        [/seven/g, "seven7seven"],
        [/eight/g, "eight8eight"],
        [/nine/g, "nine9nine"]
    ];
    re_to_number.forEach(v =>
        {
            const [re, repl] = v;
            input = input.replace(re, repl);
        })
    return input;
}

const part2 = (rawInput: string) => {
    const input = parseInput(words_to_numbers(rawInput));
    const result = input.reduce((acc:number, currval:number[]) => acc + currval[0]*10 + currval[1], 0);
    console.log(result);
    return result;
};


run({
    part1: {
        tests: [
            {
                input: `1abc2
                pqr3stu8vwx
                a1b2c3d4e5f
                treb7uchet
                `,
                expected: 142,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `two1nine
                eightwothree
                abcone2threexyz
                xtwone3four
                4nineeightseven2
                zoneight234
                7pqrstsixteen
                `,
                expected: 281,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
