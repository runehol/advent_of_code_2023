import run from "aocrunner";
import _ from "lodash";

interface Slot
{
    focal_length: number;
    label: string;
}


const parseInput = (rawInput: string) : string[] => {
    return rawInput.split(",");
};

const hash = (seq:string) : number =>
{
    let h = 0;
    seq.split("").forEach(s =>
        {
            const v = s.charCodeAt(0);
            h += v;
            h *= 17;
            h %= 256;
        });
    return h;
}

const apply_step = (boxes: Slot[][], cmd_seq:string) : void =>
{
    const regexp = /^([A-Za-z]+)([-=])(\d+)?$/
    const res = cmd_seq.match(regexp);
    if(res === null) throw "";
    const label = res[1];
    const box_num = hash(label);
    const op = res[2];
    switch(op)
    {
        case '-':
            boxes[box_num] = boxes[box_num].filter(slot => slot.label != label);
            break;
        case '=':
            let existing = false;
            const focal_length = parseInt(res[3]);
            boxes[box_num] = boxes[box_num].map(slot => 
                {
                    if(slot.label == label)
                    {
                        existing = true;
                        return {label, focal_length}
                    } else {
                        return slot;
                    }
                })
            if(!existing)
            {
                boxes[box_num].push({label, focal_length});
            }
    }
}

    


const score_boxes = (boxes : Slot[][]) : number =>
{
    return _.sum(boxes.flatMap((slots, box_num) => slots.map((lens, slot_num) => (box_num+1) * (slot_num+1) * lens.focal_length)));
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    return _.sum(input.map(hash));
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const boxes : Slot[][] = Array(256).fill([]);
    input.forEach(v => apply_step(boxes, v));
    const score = score_boxes(boxes);
    return score;
};

run({
    part1: {
        tests: [
            {
                input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
                expected: 1320,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
                expected: 145,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
