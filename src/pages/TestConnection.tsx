import React, { useEffect, useState } from 'react';
import { testSupabaseSetup } from '../lib/supabase';

const TestConnection = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runTests = async () => {
      try {
        const results = await testSupabaseSetup();
        setTestResults(results);
        if (!results.success) {
          setError(results.error?.message || 'Test failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    runTests();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Testing Supabase connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Supabase Connection Test Results</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {testResults && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Connection Status</h2>
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className={`h-2 w-2 rounded-full mr-2 ${testResults.success ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  Overall Status: {testResults.success ? 'Connected' : 'Failed'}
                </p>
              </div>
            </div>

            {testResults.schema && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Schema Information</h2>
                <pre className="bg-gray-50 p-4 rounded overflow-auto">
                  {JSON.stringify(testResults.schema, null, 2)}
                </pre>
              </div>
            )}

            {testResults.auth && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Auth Status</h2>
                <pre className="bg-gray-50 p-4 rounded overflow-auto">
                  {JSON.stringify(testResults.auth, null, 2)}
                </pre>
              </div>
            )}

            {testResults.rls && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">RLS Test Results</h2>
                <pre className="bg-gray-50 p-4 rounded overflow-auto">
                  {JSON.stringify(testResults.rls, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestConnection; 