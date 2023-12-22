#!/usr/bin/env python3

import fileinput
import numpy as np
import sys
import collections
import copy


P3D = collections.namedtuple("P3D", ["x", "y", "z"])
Brick = collections.namedtuple("Brick", ["min", "max", "id"])
P2D = collections.namedtuple("P2D", ["x", "y"])

orig_bricks = []
for idx, line in enumerate(fileinput.input()):
    _min, _max = [P3D(*[int(c) for c in p.split(",")]) for p in line.split("~")]
    orig_bricks.append(Brick(_min, _max, idx))

def try_disintegrate(start, _supported_by, supports):
    supported_by = copy.deepcopy(_supported_by)

    q = collections.deque([start])

    n_falling = 0
    while len(q):
        b = q.popleft()
        for s in supports[b]:
            supported_by[s].remove(b)
            if len(supported_by[s]) == 0:
                n_falling += 1
                q.append(s)
    return n_falling



def run():

    bricks = sorted(orig_bricks, key=lambda b: (b.min.z, b.min.y, b.min.x, b.max.z, b.max.y, b.max.x, b.id))

    floor = collections.defaultdict(lambda: [])

    supported_by = collections.defaultdict(lambda: set())
    supports = collections.defaultdict(lambda: set())
    for b in bricks:
        last_level = 0

        for x in range(b.min.x, b.max.x+1):
            for y in range(b.min.y, b.max.y+1):
                p = P2D(x, y)
                last_level = max(len(floor[p]), last_level)

        level = last_level + 1

        if last_level == 0:
            supported_by[b.id].add(-1)

        for x in range(b.min.x, b.max.x+1):
            for y in range(b.min.y, b.max.y+1):
                p = P2D(x, y)
                tower = floor[p]
                while len(tower) < last_level: tower.append(None)

                if len(tower) != 0 and tower[-1] != None:
                    supported_by[b.id].add(tower[-1])
                    supports[tower[-1]].add(b.id)

                for z in range(b.min.z, b.max.z+1):
                    tower.append(b.id)
                floor[p] = tower


    single_supports = set()
    for b, by in supported_by.items():
        if len(by) == 1 and list(by)[0] != -1:
            single_supports.add(list(by)[0])
    result = len(bricks) - len(single_supports)

    print("Part 1:", result)

    n_total = 0
    for b in bricks:
        n = try_disintegrate(b.id, supported_by, supports)
        n_total += n
    print("Part 2:", n_total)


run()
