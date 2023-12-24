import run from "aocrunner";
import _ from "lodash";

interface P3D
{
    x: number;
    y: number;
    z: number;
}

interface Ray
{
    position: P3D;
    direction: P3D;
}

const parseInput = (rawInput: string) : Ray[] => {
    return rawInput.split("\n").map(ln =>
        {
            const [p, d] = ln.split(" @ ");
            const ps = p.split(", ").map(v => parseInt(v))
            const ds = d.split(", ").map(v => parseInt(v))
            const position = { x:ps[0], y:ps[1], z:ps[2]};
            const direction = { x:ds[0], y:ds[1], z:ds[2]};
            return { position, direction }
        });
};

interface TestArea
{
    min: number;
    max:number;
}

const intersects_forward_2d = (a:Ray, b:Ray) : P3D|undefined =>
{
    // p = a.position + u * a.direction
    // p = b.position + v * b.direction
    const dx = b.position.x - a.position.x;
    const dy = b.position.y - a.position.y;
    const det = b.direction.x * a.direction.y - b.direction.y * a.direction.x;
    if(det != 0)
    {
        const u = (dy * b.direction.x - dx * b.direction.y) / det;
        const v = (dy * a.direction.x - dx * a.direction.y) / det;
        if(u >= 0 && v >= 0)
        {
            const x = a.position.x + u * a.direction.x;
            const y = a.position.y + u * a.direction.y;
            const z = a.position.z + u * a.direction.z;
            return {x, y, z}
        }
    }
    return undefined;
}

const intersects_forward_3d = (a:Ray, b:Ray) : P3D|undefined =>
{
    // p = a.position + u * a.direction
    // p = b.position + v * b.direction
    const dx = b.position.x - a.position.x;
    const dy = b.position.y - a.position.y;
    const det = b.direction.x * a.direction.y - b.direction.y * a.direction.x;
    if(det != 0)
    {
        const u = (dy * b.direction.x - dx * b.direction.y) / det;
        const v = (dy * a.direction.x - dx * a.direction.y) / det;
        if(u >= 0 && v >= 0)
        {
            const x = a.position.x + u * a.direction.x;
            const y = a.position.y + u * a.direction.y;
            const z1 = a.position.z + u * a.direction.z;
            const z = b.position.z + v * b.direction.z;
            if(z1 === z)
            {
                return {x, y, z}
            }
        }
    }
    return undefined;
}


const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const test_area = { min: 200000000000000, max: 400000000000000};
    const is = input.flatMap((a, i) => input.map((b, j) => {
        if(j > i)
        {
            const inters = intersects_forward_2d(a, b);
            if(inters === undefined) return 0;
            if(inters.x >= test_area.min && inters.x <= test_area.max)
            {
                if(inters.y >= test_area.min && inters.y <= test_area.max)
                {
                    return 1;
                }
            }
        }
        return 0;
    }));
    const n_intersections = _.sum(is);

    console.log(n_intersections);
    return n_intersections;
};

const part2 = (rawInput: string) => {
};

run({
    part1: {
        tests: [
        ],
        solution: part1,
    },
    part2: {
        tests: [
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
