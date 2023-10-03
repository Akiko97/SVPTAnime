import { writable } from 'svelte/store'

export const registers = writable([
  {
    name: 'YMM0',
    size: 8,
    values: [0, 1, 2, 3, 4, 5, 6, 7],
    stroke: 'green',
    fill: 'yellow',
  },
  {
    name: 'YMM1',
    size: 8,
    values: [7, 6, 5, 4, 3, 2, 1, 0],
    stroke: 'green',
    fill: 'red',
  }
])

export const register_config = [
  {
    name: 'YMM0',
    stroke: 'green',
    fill: 'yellow',
  },
  {
    name: 'YMM1',
    stroke: 'green',
    fill: 'red',
  }
]
