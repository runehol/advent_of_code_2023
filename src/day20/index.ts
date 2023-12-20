import run from "aocrunner";
import { Queue } from '@datastructures-js/queue';
import { memoize } from "../utils/index.js";
import _ from "lodash";

type ModuleKind = "flip-flop"|"conjunction"|"broadcast";

interface Module
{
    name: string;
    kind: ModuleKind;
    inbound_connections: number[];
    outbound_connections: number[];
    state_slots: Map<number, number>;

}

interface Circuit
{
    name_to_module: Map<string, number>;
    modules: Module[];
    n_state_slots: number;
}

type State = number[];

const get_or_register_module = (c: Circuit, name: string) : number =>
{
    let id = c.name_to_module.get(name);
    if(id === undefined)
    {
        id = c.modules.length
        c.name_to_module.set(name, id)
        c.modules.push({name: "", kind: "broadcast", inbound_connections:[], outbound_connections: [], state_slots: new Map<number, number>()});
    }
    return id;
}

const parseInput = (rawInput: string) => {
    let c: Circuit = {
        name_to_module: new Map<string, number>(),
        modules: [],
        n_state_slots: 0
    }
    get_or_register_module(c, "broadcaster"); //broadcast always 0

    const lines = rawInput.split("\n");

    lines.forEach(ln => {
        let [name, cn] = ln.split(" -> ")
        const connection_names = cn.split(", ");
        let kind: ModuleKind = "broadcast";
        switch(name[0])
        {
            case '%':
                kind = "flip-flop";
                name = name.slice(1);
                break;
            case '&':
                kind = "conjunction";
                name = name.slice(1);
                break;
            
        }
        const m_id = get_or_register_module(c, name);
        const outbound_connections = connection_names.map(nm => get_or_register_module(c, nm));
        c.modules[m_id].name = name;
        c.modules[m_id].kind = kind;
        c.modules[m_id].outbound_connections = outbound_connections;

        outbound_connections.forEach(d_id => c.modules[d_id].inbound_connections.push(m_id));

    })


    //fix up state slots
    c.modules.map(m =>
        {
            switch(m.kind)
            {
            case 'broadcast':
                break;
            case 'flip-flop':
                m.state_slots.set(0, c.n_state_slots++);
                break;
            case 'conjunction':
                m.inbound_connections.forEach(id => m.state_slots.set(id, c.n_state_slots++));
                break;
            }
        });
    return c;
};

const initial_state = (c:Circuit) : State => Array(c.n_state_slots).fill(0);

type Counts = [number, number]

type SetHigh =  Set<number>

interface Pulse
{
    from: number;
    pulse: number;
    to: number;
}
const push_button = (c:Circuit, s:State) : [Counts, SetHigh, State] =>
{
    s = s.slice()
    let n_pulses: Counts = [0, 0];
    let to_process : Queue<Pulse> = new Queue([{from:-1, pulse: 0, to: 0}]); // initial pulse to broadcast
    let set_high = new Set<number>();
    while(!to_process.isEmpty())
    {
        const msg = to_process.dequeue();
        const m = c.modules[msg.to];
        const p = msg.pulse;
        n_pulses[p]++;
        //console.log(msg.from != -1 ? c.modules[msg.from].name : "button", p, c.modules[msg.to].name)
        let result: number|undefined = undefined;
        switch(m.kind)
        {
            case 'flip-flop':
                if(!p)
                {
                    const slot = m.state_slots.get(0);
                    if(slot === undefined) throw "unknown slot";
                    s[slot] = s[slot] ^ 1;
                    result = s[slot];
                }
                break;
            case 'conjunction':
                const in_slot = m.state_slots.get(msg.from);
                if(in_slot === undefined) throw "unknown slot";
                s[in_slot] = p;
                if(p) set_high.add(in_slot);
                result = 0;
                for(const slot of m.state_slots.values())
                {
                    if(!s[slot]) result = 1;
                }
                break;

            case 'broadcast':
                result = p;
                break;

        }

        if(result !== undefined)
        {
            const defined_result = result;
            m.outbound_connections.forEach(dest => {
                to_process.enqueue({from:msg.to, pulse:defined_result, to:dest})
            })
        }
    }

    return [n_pulses, set_high, s];
}


const step_n = (c:Circuit, s:State, steps:number) : [Counts, State] =>
{

    let counts : Counts = [0, 0]
    for(let i = 0; i < steps; ++i)
    {
        const [inner_counts, _, new_state] = push_button(c, s);
        counts[0] += inner_counts[0]
        counts[1] += inner_counts[1]
        s = new_state;
    }
    return [counts, s];
};


const step_until_single_cond = (c:Circuit, s:State) : number =>
{

    const cycles = new Map<number, number>()
    const m_id = c.name_to_module.get("ls");
    if(m_id === undefined) throw "";
    const input_slots = Array.from(c.modules[m_id].state_slots.values());
    let n_steps = 0;
    while(1)
    {
        const [__, set_high, new_state] = push_button(c, s);
        ++n_steps;
        s = new_state;
        input_slots.forEach((slot,idx) =>
            {
                if(set_high.has(slot))
                {
                    cycles.set(idx, n_steps);
                }
            })

        if(cycles.size == 4)
        {
            let prod = 1;
            for(const v of cycles.values())
            {
                prod *= v;
            }
            return prod;
        }
    }
    throw "";
};

const part1 = (rawInput: string) => {
    const c = parseInput(rawInput);
    let s = initial_state(c);
    const [counts, s2] = step_n(c, s, 1000);
    return counts[0] * counts[1];
};

const part2 = (rawInput: string) => {
    const c = parseInput(rawInput);
    let s = initial_state(c);
    const result = step_until_single_cond(c, s);
    return result;
};

run({
    part1: {
        tests: [
            {
                input: `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`,
                expected: 32000000,
            },
            {
                input: `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`,
                expected: 11687500,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            /* {
                input: ``,
                expected: "",
            }, */
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
