import { useAtom } from "jotai"
import { tabsAtom } from "./utils/store"
import Providers from "./utils/providers"
import { PLACEHOLDERS } from "./utils/constants"
import { useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import ConfigMenu from "./components/configmenu"

function App() {
  const [tabs, setTabs] = useAtom(tabsAtom)
  const [showConfigMenu, setShowConfigMenu] = useState(false);
  const [selectedText, setSelectedText] = useState<string>("");

  const newTab = () => {
    setTabs({ current: tabs.tabs.length, tabs: [...tabs.tabs, ""] })
  }

  const changeTab = (index: number) => {
    setTabs({ ...tabs, current: index })
  }

  const closeTab = (index: number) => {
    setTabs({ current: 0, tabs: tabs.tabs.filter((_, i) => i !== index) })
  }

  useHotkeys("ctrl+j", () => setShowConfigMenu(!showConfigMenu))

  const handleMouseMove = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();
    setSelectedText(selectedText || "");
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const randomPlaceholder = PLACEHOLDERS[Math.floor(Math.random() * (PLACEHOLDERS.length))];

  return (
    <Providers>
      <div
        className="h-screen bg-secondary text-primaryText flex flex-col px-4"
      >
        <div className="flex items-center gap-2 justify-between py-2">
          <div className="flex gap-2 flex-1 overflow-auto items-center">
            {tabs.tabs.map((tab, index) => (
              <button
                key={index}
                className={`${tabs.current === index ? "bg-secondaryActive" : ""} py-2 px-4 rounded-xl flex gap-4 group`}
                onClick={() => changeTab(index)}
              >
                <div className={`whitespace-nowrap ${tabs.current === index ? "font-bold" : ""} transition-all`}>
                  {tab.length ? tab.split('\n')[0].slice(0, 20) : "Tab " + (index + 1)}
                </div>
                <button>
                  <i className={`fal fa-times text-sm text-gray-500 hover:text-primaryText transition-all ${tabs.current === index ? "" : "opacity-0 group-hover:opacity-100"}`} onClick={(e) => { e.stopPropagation(); closeTab(index) }} />
                </button>
              </button>
            ))}
            <button
              className="text-sm hover:text-primaryText text-gray-500 transition-all p-2"
              onClick={newTab}
            >
              <i className="fal fa-plus" />
            </button>
          </div>
          <div className="flex gap-4 p-2 items-center text-xl">
            <span className="font-black">
              type.
            </span>
            <button title="ctrl+j" id="config-button" onClick={() => setShowConfigMenu(!showConfigMenu)}>
              <i className="fal fa-cog" />
            </button>
            <a href="https://github.com/skks1212/type" title="contribute" target="_blank">
              <i className="fab fa-github" />
            </a>
          </div>
        </div>
        {tabs.tabs.length > 0 ? (
          <textarea
            placeholder={randomPlaceholder}
            className="bg-primary flex-1 w-full p-4 text-primaryText outline-0 resize-none rounded-2xl"
            id="editor"
            value={tabs.tabs[tabs.current]}
            onChange={e => setTabs({ ...tabs, tabs: tabs.tabs.map((tab, index) => index === tabs.current ? e.target.value : tab) })}
          />
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
            Make a new tab to start typing
            <button
              className="bg-primary rounded-lg text-primaryText p-2 px-4 mt-4 hover:font-bold transition-all"
              onClick={newTab}
            >
              New Tab <i className="far fa-plus ml-2" />
            </button>
          </div>
        )}
        {tabs.tabs.length > 0 && (
          <div className="text-gray-500 text-xs my-2 flex items-center justify-between">
            <div>
              {tabs.tabs[tabs.current].length ? tabs.tabs[tabs.current].split(" ").length : 0} words, {tabs.tabs[tabs.current].length} characters
              {!!selectedText?.length && <> &middot; <span className="text-primaryText">{selectedText.split(" ").length} words, {selectedText.length} characters selected</span></>}
            </div>
            <div className="hidden md:block">
              Need more tools? Try out the{" "}
              <a
                className="underline hover:text-primaryText transition-all"
                href="https://www.writeroo.net/desk"
                target="_blank"
              >
                Writeroo Workdesk
              </a>
            </div>
          </div>
        )}
      </div>

      <ConfigMenu show={showConfigMenu} onClose={() => setShowConfigMenu(false)} />
    </Providers>
  )
}

export default App
