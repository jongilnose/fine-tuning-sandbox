import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <nav className="shadow-lg shadow-b-gray">
        <div className={`max-w-screen-xl flex flex-wrap justify-between mx-auto p-4`}>
          <a href="/" className="flex items-center">
            Fine Tuning Sandbox
          </a>
          <div>
            <ul className="flex p-2 md:p-0 md:flex-row md:space-x-8 md:mt-0 md:border-0">
              <li>
                <Link href="/sandbox/files" className="py-2 pl-3 pr-4 rounded md:p-0 hover:text-gray-500">
                  Files
                </Link>
              </li>
              <li>
                <Link href="/sandbox/models" className="py-2 pl-3 pr-4 rounded md:p-0 hover:text-gray-500">
                  Models
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
