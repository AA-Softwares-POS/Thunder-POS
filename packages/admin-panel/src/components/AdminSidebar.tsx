import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <nav className="w-64 bg-gray-900 text-white h-screen p-6">
      <h2 className="text-xl font-bold mb-8">ThunderPOS Admin</h2>
      <ul className="space-y-4">
        <li><Link href="/admin/users">Users</Link></li>
        <li><Link href="/admin/companies">Companies</Link></li>
        <li><Link href="/admin/licenses">Licenses</Link></li>
        <li><Link href="/admin/logs">Audit Logs</Link></li>
      </ul>
    </nav>
  );
}
