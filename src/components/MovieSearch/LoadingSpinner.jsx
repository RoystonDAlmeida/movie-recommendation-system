import { Loader2 } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <Loader2 className="animate-spin h-10 w-10 text-purple-500" />
    </div>
  );
}

export default LoadingSpinner;