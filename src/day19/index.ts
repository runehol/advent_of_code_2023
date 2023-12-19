import run from "aocrunner";
import _ from "lodash";

type Variable = "x"|"m"|"a"|"s";
type Operator = '<'|'>'|'unconditional';

interface Rule
{
    variable:Variable;
    operator:Operator;
    value:number;
    destination:string;
}

interface Workflow
{
    name: string;
    rules: Rule[];
};


interface Part
{
    x: number;
    m: number;
    a: number;
    s: number;
}

type WorkflowMap = Map<string, Workflow>;
interface Input
{
    workflows: WorkflowMap;
    parts: Part[];
}



const parseInput = (rawInput: string) : Input => {
    const [wf, p] = rawInput.split("\n\n");
    const flows : Workflow[] = wf.split("\n").map(ln => {
        const [name, rest] = ln.split("{");
        const rls = rest.replace("}", "")
        const rules : Rule[] = rls.split(",").map(rl =>
            {
                let variable : Variable = 'x';
                let operator : Operator = 'unconditional';
                let value = 0;
                let destination = rl;
                if(rl.search(':') > 0)
                {
                    let v = "";
                    [v, destination] = rl.split(":");
                    variable = v[0] as Variable;
                    operator = v[1] as Operator;
                    value = parseInt(v.slice(2));
                }
                return {variable, operator, value, destination}
            })
        return {name, rules};

    })
    const workflows = new Map<string, Workflow>(flows.map(wf => [wf.name, wf]));

    const parts = p.split("\n").map(ln =>
        {
            const ma = ln.match(/{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}/)
            if(ma == null) throw "";
            const x = parseInt(ma[1]);
            const m = parseInt(ma[2]);
            const a = parseInt(ma[3]);
            const s = parseInt(ma[4]);
            return {x, m, a, s};
        })
    return { workflows, parts }
};


type Status = 'A'|'R';
const process_part = (part: Part, workflow_map:WorkflowMap) : [Part, Status] => 
{
    let queue = 'in'
    while(queue != 'A' && queue != 'R')
    {
        const flow = workflow_map.get(queue);
        if(flow === undefined) throw "undefined queue " + queue;
        let accepted = false;
        for(const rule of flow.rules)
        {
            switch(rule.operator)
            {
            case 'unconditional':
                accepted = true;
                break;
            case '<':
                if(part[rule.variable] < rule.value) accepted = true;
                break;
            case '>':
                if(part[rule.variable] > rule.value) accepted = true;
                break;
            }
            if(accepted)
            {
                queue = rule.destination;
                break;
            }
        }
    }
    return [part, queue];
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const destinations = input.parts.map(part => process_part(part, input.workflows));
    const score = _.sum(destinations.map(([part, status]) => {
        if(status == 'A')
        {
            return part.x + part.m + part.a + part.s;
        }
        return 0;
    }));
    return score;
};

interface Range
{
    min: number;
    max: number;
}

interface AbstractPart
{
    x: Range;
    m: Range;
    a: Range;
    s: Range;
}

const n_parts = (part:AbstractPart) : number =>
{
    let score = 1;
    let key: keyof typeof part;
    for(key in part)
    {
        const rng = part[key];
        const span = rng.max - rng.min + 1;
        if(span < 0) score = 0;
        else score *= span;
    }
    return score;
}

const sort_abstract_part = (workflow_map:WorkflowMap) : number => 
{
    const min = 1;
    const max = 4000;
    let to_process : [string, AbstractPart][] = [["in", { x: {min, max}, m: {min, max}, a: {min, max}, s: {min, max}}]]
    let n_accepted = 0;
    let n_rejected = 0;
    while(1)
    {
        const k = to_process.pop();
        if(k === undefined) break;
        let [queue, part] = k;
        const n = n_parts(part);
        if(n > 0)
        {
            if(queue == 'A')
            {
                n_accepted += n;
            } else if(queue == 'R')
            {
                n_rejected += n;
            } else {
                const flow = workflow_map.get(queue);
                if(flow === undefined) throw "undefined queue " + queue;
                for(const rule of flow.rules)
                {
                    const split_range = part[rule.variable];
                    let accepted_part = { ...part };
                    switch(rule.operator)
                    {
                    case 'unconditional':
                        to_process.push([rule.destination, part]);
                        break;
                    case '<':
                        accepted_part[rule.variable] = { min: split_range.min, max: rule.value-1}
                        to_process.push([rule.destination, accepted_part])
                        part[rule.variable] = {min: rule.value, max:split_range.max}
                        break;

                    case '>':
                        accepted_part[rule.variable] = { min: rule.value+1, max: split_range.max}
                        to_process.push([rule.destination, accepted_part])
                        part[rule.variable] = {min: split_range.min, max: rule.value}
                        break;
                    }
                } 
            }  
        }     
    }
    return n_accepted;
}

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const n_accepted = sort_abstract_part(input.workflows);
    return n_accepted;
};

run({
    part1: {
        tests: [
            {
                input: `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`,
                expected: 19114,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`,
                expected: 167409079868000,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
