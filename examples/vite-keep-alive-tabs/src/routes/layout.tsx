import { PerformanceMonitoringLayout } from "@/components/Performance";
import ZustandLayout from './ZustandNodeCacheKeepAlive';
import ContextLayout from "./ContextNodeCacheKeepAlive";
import ReactPortalKeepAliveLayout from "./ReactPortalKeepAlive";
import { ProLayout } from '@ant-design/pro-components';
import defaultProps from './defaultProps';
import { useState } from 'react';
import {
  GithubFilled,
  InfoCircleFilled,
  QuestionCircleFilled,
} from '@ant-design/icons';
import { Link } from 'react-router';

export default function RootLayout() {
  const [pathname, setPathname] = useState('/');

	return (
  <ProLayout
    siderWidth={216}
    bgLayoutImgList={[
      {
        src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ]}
    {...defaultProps}
    location={{
      pathname,
    }}
    avatarProps={{
      src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
      title: '七妮妮',
      size: 'small',
    }}
    actionsRender={props => {
      if (props.isMobile) return [];
      return [
        <InfoCircleFilled key="InfoCircleFilled" />,
        <QuestionCircleFilled key="QuestionCircleFilled" />,
        <GithubFilled key="GithubFilled" />,
      ];
    }}
    menuItemRender={(item, dom) => (
      // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
      <div
        onClick={() => {
          setPathname(item.path || '/');
        }}
      >
        <Link to={item.path || '/'}>{dom}</Link>
      </div>
    )}
  >
    <PerformanceMonitoringLayout>
      <ZustandLayout />
    </PerformanceMonitoringLayout>
  </ProLayout>
);
}
