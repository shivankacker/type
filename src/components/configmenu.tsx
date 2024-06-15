import { useEffect, useRef } from "react";

export default function ConfigMenu(props: {
    show: boolean
    onClose: () => void
}) {

    const { show, onClose } = props;
    const wheel = useRef<HTMLDivElement>(null);

    const menu = [
        {
            name: "Theme",
            icon: "palette",
            subMenu: [
                {
                    name: "Light",
                    icon: "sun"
                },
                {
                    name: "Dark",
                    icon: "moon"
                },
                {
                    name: "System",
                    icon: "globe"
                }
            ]
        },
        {
            name: "Font",
            icon: "font"
        }
    ]

    //const [currentTabs, setCurrentTabs] = useState({ menu: menu, current: 0 });
    //
    //const getCurrentMenu = (m: any = menu, tab: number = 0) => {
    //    return m[tab];
    //}

    useEffect(() => {
        const listener = (e: MouseEvent) => {
            const isShowing = wheel.current?.classList.contains("scale-100");
            console.log(isShowing, e.target, wheel.current)
            if (isShowing && e.target !== wheel.current) {
                onClose();
            }
        }
        document.addEventListener("click", listener)
        return () => {
            document.removeEventListener("click", listener);
        }
    }, [])
    return (
        <div
            className="absolute inset-0 flex flex-col justify-center overflow-hidden"
            style={{ pointerEvents: "none" }}
        >
            <div ref={wheel} className={`absolute ${!show ? "scale-0" : "scale-100"} -right-[200px] bg-secondary backdrop-blur rounded-full w-[400px] aspect-square transition-all flex flex-col justify-around`}>
                {menu.map((item, index) => {
                    const optionLength = menu.length / 2;
                    const quadrantSize = 100;
                    const isBottomQuadrant = index > menu.length / 2;
                    const leftOffset = isBottomQuadrant ? (index - optionLength) * quadrantSize : index * quadrantSize;

                    return (
                        <div style={{ marginLeft: leftOffset }}>
                            <button key={index} className={`inline-flex items-center justify-center aspect-square h-20 text-primaryText text-3xl hover:bg-secondaryActive rounded-full`}>
                                <i className={`fal fa-${item.icon}`} />
                            </button>
                        </div>
                    )
                })}
                <div
                    className="absolute inset-0 rounded-full scale-[0.4] bg-primary"
                />
            </div>
        </div>
    )
}