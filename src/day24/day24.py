#!/usr/bin/env python3

import z3
import fileinput


hails = []
for line in fileinput.input():
    line = line.strip()
    p, d = line.split(" @ ")
    position = [int(v) for v in p.split(", ")]
    direction = [int(v) for v in d.split(", ")]
    hails.append( (position, direction) )

var = z3.Real
px = var('px')
py = var('py')
pz = var('pz')
dx = var('dx')
dy = var('dy')
dz = var('dz')

s = z3.Solver()

for idx, h in enumerate(hails):
    t = z3.Real('v' + str(idx))
    pos, dir = h
    s.add(t >= 0)
    s.add(px + dx * t == pos[0] + dir[0] * t)
    s.add(py + dy * t == pos[1] + dir[1] * t)
    s.add(pz + dz * t == pos[2] + dir[2] * t)

print(s.check())
model = s.model()
print(model.eval(px + py + pz))
