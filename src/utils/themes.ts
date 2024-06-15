import { Theme } from "../types/config";

export const THEMES = [
    {
        id: Theme.Light,
        name: "Light",
        colors: {
            primary: "#FFFFFF",
            secondary: "#efefef",
            secondaryActive: "#e8e8e8",
            primaryText: "#000"
        }
    },
    {
        id: Theme.Dark,
        name: "Dark",
        colors: {
            primary: "#000000",
            secondary: "#151515",
            secondaryActive: "#212121",
            primaryText: "#fff"
        }
    }
]