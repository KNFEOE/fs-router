import { Keepalive } from "@/components/Keepalive"
import { Tabs } from "@/components/Tabs"
import { TabsManager } from "@/components/TabsManager"
import Header from "./header"

export default function Layout() {
  return (
    <TabsManager>
      <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
        <div className="container max-w-screen-lg mx-auto">
          <Header />
          <Tabs />
        </div>

        <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
          <div className="flex-1 container max-w-screen-lg mx-auto">
            <Keepalive />
          </div>
        </div>
      </div>
    </TabsManager>
  )
}