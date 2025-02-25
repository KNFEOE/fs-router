// SmartLink.tsx
import { Link as BaseLink, NavLink as BaseNavLink, LinkProps, NavLinkProps, useResolvedPath } from 'react-router';
import { namespace } from '@/routes/layout.data';

export const Link = ({ to, ...props }: LinkProps) => {
  console.log('namespace', namespace);
  const { pathname } = useResolvedPath('');
  const isShell = pathname.startsWith(`/${namespace}`);
  const processedTo = typeof to === 'string'
    ? (isShell ? `/${namespace}${to}` : to)
    : { ...to, pathname: isShell ? `/${namespace}${to.pathname}` : to.pathname };
console.log('processedTo', processedTo);

  return <BaseLink to={processedTo} {...props} />;
};

export const NavLink = ({ to, ...props }: NavLinkProps) => {
  console.log('namespace', namespace);
  const { pathname } = useResolvedPath('');
  const isShell = pathname.startsWith(`/${namespace}`);
  const processedTo = typeof to === 'string'
    ? (isShell ? `/${namespace}${to}` : to)
    : { ...to, pathname: isShell ? `/${namespace}${to.pathname}` : to.pathname };
  console.log('processedTo', processedTo);

  return <BaseNavLink to={processedTo} {...props} />;
}