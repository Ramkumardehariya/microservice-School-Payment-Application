// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Page not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;