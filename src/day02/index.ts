import run from "aocrunner";


interface Round
{
    picks: Map<string, number>;
}

interface Game
{
    id: number;
    rounds: Round[];
}

const parseInput = (rawInput: string) : Game[] => {
    return rawInput.split("\n").map(game =>
        {
            const g = game.split(": ");
            const id = parseInt(g[0].split(" ")[1])
            const rounds = g[1].split("; ").map(round =>
                {
                    const picks = new Map<string, number>();
                    round.split(", ").forEach(pick =>
                        {
                            const s = pick.split(" ");
                            const count = parseInt(s[0]);
                            const colour = s[1];
                            picks.set(colour, count);
                        }) 
                    return { picks };
                });
            return {
                id, rounds
            }
        });
};

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const valid_games = input.filter(game => 
        {
            let valid = true;
            game.rounds.forEach(round =>
                {
                    round.picks.forEach((count:number, colour:string) =>
                        {
                            switch(colour)
                            {
                            case 'red':
                                if(count > 12) valid = false;
                                break;
                            case 'green':
                                if(count > 13) valid = false;
                                break;
                            case 'blue':
                                if(count > 14) valid = false;
                                break;
                            default:
                                valid = false;
                                break;
                            }
                        })
                    });
            return valid;
        });

    const sum = valid_games.reduce((acc, game) => acc+game.id, 0);
    return sum;
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const sets = input.map(game => 
        {
            const min_of_each = new Map<string, number>();
            game.rounds.forEach(round =>
                {
                    round.picks.forEach((count:number, colour:string) =>
                        {
                            min_of_each.set(colour, Math.max(min_of_each.get(colour)||0, count));
                        })
                    });
            return min_of_each;
        });
    const powers = sets.map(s => Array.from(s.values()).reduce((acc, count) => acc*count), 1);
    const sum = powers.reduce((acc, p) => acc+p, 0);
    return sum;
};

run({
    part1: {
        tests: [
             {
               input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
 `,
               expected: 8,
             },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
 Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
 Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
 Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
 Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
  `,
                expected: 2286,
              },
         ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
