export enum Theme {
    Light = 'light',
    Dark = 'dark',
}

export interface Config {
    font: {
        size: number;
        family: string;
        lineHeight: number;
        opacity: number;
    }
    theme: Theme | null;
}