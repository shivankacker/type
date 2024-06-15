import { useAtom } from "jotai"
import { configAtom, tabsAtom } from "./utils/store"
import Providers from "./utils/providers"
import { PLACEHOLDERS } from "./utils/constants"
import { useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import ConfigMenu from "./components/configmenu"

function App() {

  const [config, setConfig] = useAtom(configAtom)
  const [tabs, setTabs] = useAtom(tabsAtom)
  const [showConfigMenu, setShowConfigMenu] = useState(false);

  const newTab = () => {
    setTabs({ current: tabs.tabs.length, tabs: [...tabs.tabs, ""] })
  }

  const changeTab = (index: number) => {
    setTabs({ ...tabs, current: index })
  }

  const closeTab = (index: number) => {
    setTabs({ current: 0, tabs: tabs.tabs.filter((_, i) => i !== index) })
  }

  useHotkeys("ctrl+shift+c", () => setShowConfigMenu(!showConfigMenu))

  return (
    <Providers>
      <div
        className="h-screen bg-secondary text-primaryText flex flex-col p-4 pt-0"
      >
        <div className="flex items-center gap-2 justify-between py-2">
          <div className="flex gap-2">
            {tabs.tabs.map((tab, index) => (
              <button
                key={index}
                className={`${tabs.current === index ? "bg-secondaryActive" : ""} py-2 px-4 rounded-xl flex gap-4 group`}
                onClick={() => changeTab(index)}
              >
                <div>
                  {tab.length ? tab.slice(0, 20) : "Tab " + (index + 1)}
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
            <button onClick={() => setShowConfigMenu(!showConfigMenu)}>
              <i className="fal fa-cog" />
            </button>
            <a href="https://github.com/skks1212/type" title="contribute" target="_blank">
              <i className="fab fa-github" />
            </a>
          </div>
        </div>
        <textarea
          placeholder={PLACEHOLDERS[Math.floor(Math.random() * (PLACEHOLDERS.length))]}
          className="bg-primary flex-1 w-full p-4 text-primaryText outline-0 resize-none rounded-2xl"
          id="editor"
          value={tabs.tabs[tabs.current]}
          onChange={e => setTabs({ ...tabs, tabs: tabs.tabs.map((tab, index) => index === tabs.current ? e.target.value : tab) })}
        />
      </div>
      <ConfigMenu show={showConfigMenu} onClose={() => setShowConfigMenu(false)} />
    </Providers>
  )
}

export default App
