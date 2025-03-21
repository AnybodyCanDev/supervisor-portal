"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./icon-wrapper";

export default function Sidebar() {
  const pathname = usePathname(); // Get current path

  const links = [
    { href: "/", icon: "description" },
    { href: "/flags", icon: "report" },
    { href: "/thresholds", icon: "manage_accounts" },
    { href: "/invoices", icon: "receipt_long" },
    { href: "/receipts", icon: "inventory" },
  ];

  return (
    <div className="relative py-4 flex flex-col shadow-slate-200 shadow-md bg-white rounded-xl h-fit">
      {/* Navigation Links */}
      <ul className="flex flex-col gap-4 text-slate-400">
        {links.map(({ href, icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={`flex items-center border-x-4 border-x-white gap-2 px-3 py-2 duration-200 ${
                pathname === href
                  ? "text-blue-500  border-l-blue-500" // Active link style
                  : "hover:bg-gray-100"
              }`}
            >
              <Icon icon={icon} fill={pathname === href ? 1 : 0}/>
            </Link>
          </li>
        ))}
      </ul>

      {/* Bottom Section */}
      <div className="mt-48 flex flex-col gap-4 text-slate-400 items-center">
        <Link href="/">
          <Icon icon="chevron_right" />
        </Link>
      </div>
    </div>
  );
}


{/* <div>
<label htmlFor="my-drawer-2" className="drawer-overlay">This is the Sidbar</label>
<ul className="flex flex-col gap-2 bg-white">
  <li><Link href="/logs">
      <Icon icon='description'/>System Logs
  </Link></li>
  <li><Link href="/flags">Raised Flags</Link></li>
  <li><Link href="/thresholds">Approval Thresholds</Link></li>
  <li><Link href="/invoices">PDF Invoices</Link></li>
  <li><Link href="/receipts">Receipts</Link></li>
  <li><Link href="/analytics">Analytics</Link></li>
</ul>
</div> */}