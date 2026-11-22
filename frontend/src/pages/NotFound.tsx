import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-paper text-carbon text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-clay-50 text-clay-600 flex items-center justify-center">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-carbon">404</h1>
      <h2 className="text-lg font-bold text-carbon">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-carbon-2 max-w-sm">
        The claim review page or dispute view you requested does not exist or has been relocated.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
            Return to ClaimKavach
          </Button>
        </Link>
      </div>
    </div>
  );
};
