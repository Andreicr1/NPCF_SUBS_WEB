// @ts-nocheck
'use client';

import { useAuth } from "react-oidc-context";

export default function AuthButtons() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "2amt18k5uhrjtkklvpcotbtp8n";
    const logoutUri = typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}`
      : 'http://localhost:3000';
    const cognitoDomain = "https://us-east-12tppesefc.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Error:</p>
        <p className="text-sm">{auth.error.message}</p>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-900">{auth.user?.profile.email}</span></p>
            <p><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-900">{auth.user?.profile.name || 'N/A'}</span></p>
            <p><span className="font-medium text-gray-700">Phone:</span> <span className="text-gray-900">{auth.user?.profile.phone_number || 'N/A'}</span></p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <details className="text-xs">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">ID Token</summary>
            <pre className="mt-2 p-2 bg-white rounded border overflow-x-auto text-[10px]">{auth.user?.id_token}</pre>
          </details>
          <details className="text-xs">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">Access Token</summary>
            <pre className="mt-2 p-2 bg-white rounded border overflow-x-auto text-[10px]">{auth.user?.access_token}</pre>
          </details>
          <details className="text-xs">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">Refresh Token</summary>
            <pre className="mt-2 p-2 bg-white rounded border overflow-x-auto text-[10px]">{auth.user?.refresh_token}</pre>
          </details>
        </div>

        <button 
          onClick={signOutRedirect}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button 
        onClick={() => auth.signinRedirect()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        Sign In with AWS Cognito
      </button>
    </div>
  );
}
