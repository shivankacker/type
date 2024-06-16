import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Theme } from "../types/config";
import { configAtom } from "../utils/store";
import { useAtom } from "jotai";
import TaurusDonut from "./donut";

export default function ConfigMenu(props: {
    show: boolean
    onClose: () => void
}) {

    const { show, onClose } = props;
    const wheel = useRef<HTMLDivElement>(null);
    const [config, setConfig] = useAtom(configAtom)
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);
    const setTheme = (theme: Theme | null) => {
        setConfig({ ...config, theme })
    }
    const setFont = (font: string) => {
        setConfig({ ...config, font: { ...config.font, family: font } })
    }
    const setLineHeight = (lineHeight: number) => {
        setConfig({ ...config, font: { ...config.font, lineHeight: lineHeight / 10 } })
    }

    const setOpacity = (opacity: number) => {
        setConfig({ ...config, font: { ...config.font, opacity: opacity / 10 } })
    }

    const setTextSize = (size: number) => {
        setConfig({ ...config, font: { ...config.font, size } })
    }

    const menu = [
        {
            name: "Theme",
            icon: "palette",
            value: config.theme,
            onChange: setTheme,
            subMenu: [
                {
                    name: "Light",
                    icon: "sun",
                    value: Theme.Light
                },
                {
                    name: "Dark",
                    icon: "moon",
                    value: Theme.Dark
                },
                {
                    name: "System",
                    icon: "globe",
                    value: null
                }
            ]
        },
        {
            name: "Font",
            icon: "font",
            onChange: setFont,
            value: config.font.family,
            subMenu: [
                {
                    name: "Monospace",
                    icon: "code",
                    value: "Menlo, monospace",
                },
                {
                    name: "Sans-Serif",
                    icon: "font",
                    value: "Arial, sans-serif"
                },
                {
                    name: "Serif",
                    icon: "book",
                    value: "Georgia, serif"
                }
            ]
        },
        {
            name: "Line Height",
            icon: "ruler",
            value: config.font.lineHeight * 10,
            minLimit: 10,
            maxLimit: 25,
            onChange: setLineHeight
        },
        {
            name: "Opacity",
            icon: "ghost",
            value: config.font.opacity * 10,
            minLimit: 5,
            maxLimit: 10,
            onChange: setOpacity
        },
        {
            name: "Text Size",
            icon: "text-height",
            value: config.font.size,
            minLimit: 10,
            maxLimit: 100,
            onChange: setTextSize
        }
    ]

    useEffect(() => {
        const container = wheel.current;
        if (container) {
            const radius = container.offsetWidth / 2;
            const padding = (400 - 150 - 120) / 2;
            const adjustedRadius = radius - padding;
            [
                [menu, "data-item"],
                [menu[selectedItem || 0].subMenu, "data-subitem"]
            ].forEach(([items, attribute]) => {
                if (!items) return;
                const itemElements = container.querySelectorAll(`[${attribute}]`) as NodeListOf<HTMLElement>;
                const angleStep = (2 * Math.PI) / items.length;

                for (let i = 0; i < items.length; i++) {
                    const angle = ((i - selectedIndex) * angleStep) - Math.PI / 2;
                    const element = itemElements[i] as HTMLElement;
                    if (!element) return;
                    const x = radius + adjustedRadius * Math.cos(angle) - element.offsetWidth / 2;
                    const y = radius + adjustedRadius * Math.sin(angle) - element.offsetHeight / 2;

                    if (attribute === "data-subitem" || selectedItem !== i) {
                        element.style.position = 'absolute';
                        element.style.left = `${x}px`;
                        element.style.top = `${y}px`;
                    }
                }
            });
        }
    }, [menu, selectedIndex, selectedItem]);

    useEffect(() => {
        if (!show) {
            setSelectedItem(null);
            setSelectedIndex(0);
        }
    }, [show])

    useEffect(() => {
        if (selectedItem !== null) {
            const item = menu[selectedItem];
            switch (item.name) {
                case "Theme":
                case "Font":
                    setSelectedIndex(item.subMenu?.findIndex(s => s.value === item.value) || 0)
                    break;
            }
        }
    }, [selectedItem]);

    useEffect(() => {
        if (selectedItem !== null) {
            const item = menu[selectedItem];
            if (item?.subMenu) {
                item.onChange(item.subMenu[selectedIndex].value as any)
            }
        }
    }, [selectedIndex])

    useEffect(() => {
        const listener = (e: MouseEvent) => {
            const wheel = document.getElementById("config-wheel");
            const button = document.getElementById("config-button");
            if (!wheel || !button) return;
            const isShowing = wheel.classList.contains("scale-100");
            const parents = e.composedPath();
            const target = e.target as HTMLElement;
            if (
                isShowing
                && target !== button
                && target !== wheel
                && !parents.includes(wheel)
                && !parents.includes(button)
            ) {
                onClose();
            }
        }
        document.addEventListener("click", listener)
        return () => {
            document.removeEventListener("click", listener);
        }
    }, [])

    useHotkeys("esc", () => {
        if (selectedItem !== null) {
            setSelectedItem(null);
            setSelectedIndex(0)
        } else {
            onClose();
        }
    });
    useHotkeys("left", () => {
        if (selectedItem === null) {
            setSelectedIndex((selectedIndex - 1 + menu.length) % menu.length);
        } else {
            const submenu = menu[selectedItem].subMenu;
            if (submenu) {
                setSelectedIndex((selectedIndex - 1 + submenu.length) % submenu.length);
            } else {
                handleValDecrease();
            }
        }
    });
    useHotkeys("right", () => {
        if (selectedItem === null) {
            setSelectedIndex((selectedIndex + 1) % menu.length)
        } else {
            const submenu = menu[selectedItem].subMenu;
            if (submenu) {
                setSelectedIndex((selectedIndex + 1) % submenu.length)
            } else {
                handleValIncrease();
            }
        }
    });
    useHotkeys("enter", () => {
        if (selectedItem !== null) {
            setSelectedItem(null);
        } else {
            setSelectedItem(selectedIndex);
        }
    });

    const handleValDecrease = () => {
        if (selectedItem === null) return;
        const min = menu[selectedItem].minLimit || 0;
        const val = menu[selectedItem].value as number || 0;
        if (val > min) {
            const onChange = menu[selectedItem].onChange as any;
            onChange(val - 1);
        }
    }

    const handleValIncrease = () => {
        if (selectedItem === null) return;
        const max = menu[selectedItem].maxLimit || 0;
        const val = menu[selectedItem].value as number || 0;
        if (val < max) {
            const onChange = menu[selectedItem].onChange as any;
            onChange(val + 1);
        }
    }

    const getPercentage = (value: number) => {
        const min = menu[selectedItem as number].minLimit || 0;
        const max = menu[selectedItem as number].maxLimit || 100;
        const percentage = ((value - min) / (max - min)) * 100;
        return percentage;
    }

    return (
        <div ref={wheel} id="config-wheel" className={`fixed ${!show ? "scale-0" : "scale-100"} left-[calc(50vw-200px)] top-[calc(50vh-200px)] border border-secondary backdrop-blur rounded-full w-[400px] aspect-square transition-all flex flex-col justify-around`}>
            {menu.map((item, index) => {
                return (
                    <div
                        className={`transition-all z-10 ${selectedItem !== null && selectedItem !== index ? "translate-x-10 invisible opacity-0" : "translate-x-0 visible opacity-1"} `}
                        style={selectedItem === index ? {
                            top: "160px",
                            left: "160px"
                        } : undefined}
                        data-item
                        key={index}
                    >
                        <button
                            className={`relative inline-flex flex-col items-center justify-center aspect-square h-20 text-primaryText text-3xl group rounded-full`}
                            onClick={() => setSelectedItem(index)}
                        >
                            <i className={`fa${selectedIndex === index || selectedItem === index ? "s" : "l"} fa-${item.icon}`} />
                            <div className={`text-xs mt-2`}>
                                {selectedItem === index && index > 1 ? menu[selectedItem].value : item.name}
                            </div>
                            <div className={`absolute inset-0 ${selectedItem === index ? "" : ` bg-primaryText ${(selectedIndex === index ? "opacity-10 group-hover:opacity-15" : "opacity-0 group-hover:opacity-10")}`} rounded-full transition-all`} />
                        </button>
                    </div>
                )
            })}
            {menu[selectedItem !== null ? selectedItem : selectedIndex].subMenu && menu[selectedItem !== null ? selectedItem : selectedIndex].subMenu?.map((item, index) => (
                <div
                    className={`transition-all z-10 ${selectedItem === null ? "translate-x-10 invisible opacity-0" : "translate-x-0 visible opacity-1"}`}
                    key={index}
                    data-subitem
                >
                    <button
                        className={`relative inline-flex flex-col items-center justify-center aspect-square h-20 text-primaryText text-3xl group rounded-full`}
                        onClick={() => {
                            setSelectedIndex(index)
                        }}
                    >
                        <i className={`fa${selectedIndex === index ? "s" : "l"} fa-${item.icon}`} />
                        <div className={`text-xs mt-2`}>
                            {item.name}
                        </div>
                        <div className={`absolute inset-0 bg-primaryText ${(selectedIndex === index ? "opacity-10 group-hover:opacity-15" : "opacity-0 group-hover:opacity-10")} rounded-full transition-all`} />
                    </button>
                </div>
            ))}
            {selectedItem !== null && menu[selectedItem].maxLimit && (
                <div
                    className="rounded-full overflow-hidden absolute inset-0 opacity-10"
                    onMouseDown={(e) => {
                        setMousePosition({ x: e.clientX, y: e.clientY })
                    }}
                    onMouseUp={() => {
                        setMousePosition(null)
                    }}
                    onMouseMove={(e) => {
                        const circle = e.target as HTMLElement;
                        const { left, top, width, height } = circle.getBoundingClientRect();
                        const centerX = left + width / 2;
                        const centerY = top + height / 2;
                        if (mousePosition) {
                            const dx = e.clientX - centerX;
                            const dy = e.clientY - centerY;
                            let angle = Math.atan2(dy, dx) * (180 / Math.PI); // Should have taken that trigonometry class

                            if (angle < 0) {
                                angle += 360;
                            }
                            const newProgress = Math.min(Math.max((angle / 360) * 100, 0), 100);
                            const min = menu[selectedItem as number].minLimit || 0;
                            const max = menu[selectedItem as number].maxLimit || 100;
                            const value = Math.floor(min + (max - min) * (newProgress / 100));
                            const onChange = menu[selectedItem as number].onChange as any;
                            onChange(value);
                            setMousePosition({ x: e.clientX, y: e.clientY })
                        }
                    }}
                >
                    <TaurusDonut
                        filledPercentage={getPercentage(
                            menu[selectedItem].value as number
                        )}
                        innerRadius={75}
                        outerRadius={200}
                    />
                </div>
            )
            }
            <div
                className="absolute overflow-hidden inset-[125px] w-[150px] rounded-full bg-primary opacity-50 border border-secondaryActive flex items-center justify-between"
            >
                {[
                    { fn: handleValDecrease, icon: "minus" },
                    { fn: handleValIncrease, icon: "plus" }
                ].map((item, index) => (
                    <button
                        className="text-primaryText p-4 h-full outline-0"
                        style={{
                            display: selectedItem !== null && menu[selectedItem].minLimit ? "inline" : "none"
                        }}
                        onClick={item.fn}
                        key={index}
                    >
                        <i className={`fa fa-${item.icon}`} />
                    </button>
                ))}
                <button
                    className="absolute bottom-0 w-[40px] left-[calc(50%-20px)] text-primaryText p-4"
                    style={{
                        display: selectedItem !== null ? "inline" : "none"
                    }}
                    onClick={() => setSelectedItem(null)}
                >
                    <i className="fa fa-check" />
                </button>
            </div>
        </div >
    )
}