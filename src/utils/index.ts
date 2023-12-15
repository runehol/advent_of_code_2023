/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.ts,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.ts'
 *     import { myUtil } from '../utils/index.ts'
 *
 *   also incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 *
 */

import { ICompare, PriorityQueue } from "@datastructures-js/priority-queue";
import _ from 'lodash';
import { assert } from "console";


export function memoize<Args extends unknown[], Result>(
    func: (...args: Args) => Result
): (...args: Args) => Result {
    const stored = new Map<string, Result>();

    return (...args) => {
        const k = JSON.stringify(args);
        if (stored.has(k)) {
            return stored.get(k)!;
        }
        const result = func(...args);
        stored.set(k, result);
        return result;
    };
}







const a_star = <Position, >(starts: Position[], goal: Position, h:(p: Position) => number, d:(from: Position, to: Position) => number, find_neighbours:(from: Position) => Position[], is_equal:(a:Position, b:Position)=>boolean) : Position[] =>
{
    interface Candidate {
        position: Position;
        f_score: number;
    }
    
    const compare_candidates: ICompare<Candidate> = (a: Candidate, b: Candidate) => 
    {
        // lowest g scores first
        return a.f_score < b.f_score ? -1 : 1;
    };
    
    const infinity = 1<<30;
    const lookup = (map:Map<string, number>, key:Position) =>
    {
        return map.get(JSON.stringify(key)) ?? infinity;
    }

    const insert = (map:Map<string, number>, key:Position, value:number) =>
    {
        map.set(JSON.stringify(key), value);
    }

    const open_set = new PriorityQueue<Candidate>(compare_candidates);
    const g_score = new Map<string, number>;
    starts.forEach(start => {
        open_set.enqueue({position:start, f_score:h(start)});        
        insert(g_score, start, 0);
    });



    const came_from = new Map<string, Position>;


    while(!open_set.isEmpty())
    {
        const {position: current} = open_set.pop();
        if(is_equal(current, goal))
        {
            let path : Position[] = [];
            let c = current;
            while(1)
            {
                let prev = came_from.get(JSON.stringify(c));
                if(prev === undefined) break;
                path.push(prev);
            }
            return path.reverse();
        }


        find_neighbours(current).forEach(neighbour => {
            const tentative_g_score = lookup(g_score, current) + d(current, neighbour);
            if(tentative_g_score < lookup(g_score, neighbour))
            {
                came_from.set(JSON.stringify(neighbour), current);
                insert(g_score, neighbour, tentative_g_score);
                const neighbour_f = tentative_g_score + h(neighbour);
                open_set.push({position: neighbour, f_score: neighbour_f});
            }
            
        });
    }
    throw "should not get here";
}
