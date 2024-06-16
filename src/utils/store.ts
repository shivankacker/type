import { atomWithStorage } from 'jotai/utils'
import { Config } from '../types/config'

export const configAtom = atomWithStorage<Config>("type-config", {
    font: {
        size: 16,
        family: 'Menlo, monospace',
        lineHeight: 1.5,
        opacity: 0.7,
    },
    theme: null,
})

export const tabsAtom = atomWithStorage("type-tabs", {
    current: 0,
    tabs: [""],
})