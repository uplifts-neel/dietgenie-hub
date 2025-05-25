
// Layout now just renders its children directly since navigation is gone.
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
