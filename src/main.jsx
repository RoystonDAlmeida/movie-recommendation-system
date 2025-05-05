// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider, useUser, useAuth } from '@clerk/clerk-react';
import App from './App';
import './index.css';
import { syncUserToSupabase } from './lib/clerk-supabase';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

function Root() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncError, setSyncError] = React.useState(null);

  React.useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && user && !isSyncing) {
        setIsSyncing(true);
        setSyncError(null);
        try {
          // Get the token from 'supabase' template
          const token = await getToken({ template: "supabase" });
          
          if (!token) {
            throw new Error('Could not obtain valid token');
          }
          
          await syncUserToSupabase(user, token);
        } catch (error) {
          console.error('Error syncing user:', error);
          setSyncError(error.message);
        } finally {
          setIsSyncing(false);
        }
      }
    };
    syncUser();
  }, [isSignedIn, user, getToken, isSyncing]);

  return <App syncStatus={{ isSyncing, syncError }} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <Root />
    </ClerkProvider>
  </React.StrictMode>,
);