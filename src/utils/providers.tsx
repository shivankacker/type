import { useAtom } from "jotai"
import { configAtom } from "./store"
import { useEffect } from "react"
import { THEMES } from "./themes"

export default function Providers({ children }: { children: React.ReactNode }) {

    const [config] = useAtom(configAtom)

    const deviceTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES[1] : THEMES[0]

    const theme = THEMES.find(theme => theme.id === config.theme) || deviceTheme

    const mappings = [
        ...Object.entries(theme?.colors || {}),
        ...Object.entries(config.font)
    ]
    useEffect(() => {
        mappings.forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--type-${key}`, value.toString())
        })
        const editor = document.getElementById("editor")
        if (editor) {
            editor.style.setProperty("font-size", `${config.font.size}px`)
            editor.style.setProperty("font-family", config.font.family)
            editor.style.setProperty("line-height", `${config.font.lineHeight}`)
            editor.style.setProperty("opacity", `${config.font.opacity}`)
        }
    }, [config])


    return children
}