import { Keepalive } from "@/components/Zustand/Keepalive";
import { Tabs } from "@/components/Zustand/Tabs";
import Header from "./header";
import { useTabState } from '@/hooks/tabState.hook';

export default function ZustandLayout() {
	useTabState();

	return (
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
);
}
