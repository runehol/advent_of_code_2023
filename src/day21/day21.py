#!/usr/bin/env python3

import fileinput
import numpy as np
from scipy.ndimage import convolve

b = [[v for v in line.strip()] for line in fileinput.input()]
board = np.array(b)
height = board.shape[0]
width = board.shape[1]

shape = board.shape
not_obstacles_orig = board != '#'

start_board = board == 'S'
empty_board = np.zeros_like(start_board)

kernel = np.array([0, 1, 0, 1, 0, 1, 0, 1, 0], dtype=np.int8).reshape(3, 3)

def step_edge(positions, not_obstacles):
    next = convolve(positions, kernel, mode='constant')
    result = next & not_obstacles
    return result

#part 1:
s = start_board
for i in range(64):
    s = step_edge(s, not_obstacles_orig)

print("Part 1:", np.sum(s))


#part 2
def pad_if_necessary(board, not_obstacles):
    if np.sum(board[:1,]) + np.sum(board[-1:,:]) + np.sum(board[:,:1]) + np.sum(board[:,-1:]) > 0:
        #time to pad
        board = np.pad(board, [(height, height), (width, width)])
        not_obstacles = np.tile(not_obstacles_orig, [board.shape[0]//not_obstacles_orig.shape[0], board.shape[1]//not_obstacles_orig.shape[1]])
    return board, not_obstacles



target_steps = 26501365
cycle = width
modulo = target_steps % cycle

s = start_board
not_obstacles = not_obstacles_orig
X = []
Y = []
for i in range(0, 3*cycle):
    if i % cycle == modulo:
        X.append(i//cycle)
        Y.append(np.sum(s))

    s = step_edge(s, not_obstacles)
    s, not_obstacles = pad_if_necessary(s, not_obstacles)

coefs = np.rint(np.polynomial.polynomial.polyfit(X,Y,2)).astype(int).tolist()
x = target_steps//cycle
result = coefs[0] + coefs[1] * x + coefs[2] * x * x
print("Part 2:", result)
