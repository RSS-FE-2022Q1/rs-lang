import './Layout.pcss';

const Layout = ({ children }:React.PropsWithChildren): JSX.Element => (
  <main className="content">
    {children}
  </main>
);

export default Layout;
