import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-6xl font-light text-gray-900 dark:text-white mb-4">404</p>
        <h1 className="text-xl font-light text-gray-900 dark:text-white tracking-wide mb-2">Page Not Found</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium tracking-wide rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
          Back to Shop
        </Link>
      </div>
    </div>
  );
}
