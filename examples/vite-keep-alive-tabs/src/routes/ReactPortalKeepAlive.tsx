import { useKeepAliveRef } from "keepalive-for-react";
import KeepAliveRouteOutlet from "keepalive-for-react-router-dom";
import { useLocation } from 'react-router-dom';
import Header from "./header";
import { memo, useEffect } from 'react';
import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import { Suspense } from 'react';

export default memo(function ReactPortalKeepAliveLayout() {
  const aliveRef = useKeepAliveRef();

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Header />

      <div className="flex-1 container max-w-screen-lg mx-auto">
        <CustomSuspense>
          <KeepAliveRouteOutlet
            wrapperComponent={MemoScrollTopWrapper}
            duration={300}
            transition={true}
            exclude={['/nocache-counter']}
            aliveRef={aliveRef}
          />
        </CustomSuspense>
      </div>
    </div>
  );
});

// remember the scroll position of the page when switching routes
function MemoScrollTopWrapper(props: { children?: ReactNode }) {
	const { children } = props;
	const domRef = useRef<HTMLDivElement>(null);
	const location = useLocation();
	const scrollHistoryMap = useRef<Map<string, number>>(new Map());

	const activeKey = useMemo(() => {
		return location.pathname + location.search;
	}, [location.pathname, location.search]);

	useEffect(() => {
		const divDom = domRef.current;
		if (!divDom) return;

		setTimeout(() => {
			divDom.scrollTo(0, scrollHistoryMap.current.get(activeKey) || 0);
		}, 300); // 300 milliseconds to wait for the animation transition ending

		const onScroll = (e: Event) => {
			const target = e.target as HTMLDivElement;
			if (!target) return;
			scrollHistoryMap.current.set(activeKey, target?.scrollTop || 0);
		};

		divDom?.addEventListener("scroll", onScroll, {
			passive: true,
		});

		return () => {
			divDom?.removeEventListener("scroll", onScroll);
		};
	}, [activeKey]);

	return (
		<div
			className="animation-wrapper scrollbar w-full overflow-auto"
			style={{
				height: "calc(100vh - 82px)",
			}}
			ref={domRef}
		>
			{children}
		</div>
	);
}

function CustomSuspense(props: { children: ReactNode }) {
	const { children } = props;
	return (
		<Suspense
			fallback={
				<div className="text-center text-red-400 text-[12px] mt-[10px]">
					Loading...
				</div>
			}
		>
			{children}
		</Suspense>
	);
}
