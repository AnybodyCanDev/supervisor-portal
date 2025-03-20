import Sidebar from './sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Dashboard({ children }: LayoutProps) {
  return (
    <div className="drawer">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button m-4">
          Open Menu
        </label>
        {children}
      </div>
      <Sidebar />x
    </div>
  );
}