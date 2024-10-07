export const AGE = ['PUPPY', 'ADULT', 'SENIOR'] as const
export const SIZE = ['SMALL', 'MEDIUM', 'LARGE'] as const
export const ENVIRONMENTS_NEED = ['SPACIOUS', 'COMPACT', 'BOTH'] as const
export const INDEPENDENCE_LEVEL = ['LOW', 'MEDIUM', 'HIGH'] as const
export const ENERGY_LEVEL = [
  'VERY_LOW',
  'LOW',
  'MEDIUM',
  'HIGH',
  'VERY_HIGH',
] as const

export type Age = (typeof AGE)[number]
export type Size = (typeof SIZE)[number]
export type EnvironmentNeed = (typeof ENVIRONMENTS_NEED)[number]
export type IndependenceLevel = (typeof INDEPENDENCE_LEVEL)[number]
export type EnergyLevel = (typeof ENERGY_LEVEL)[number]
