import { useEffect, useState } from 'react';
import {
  testDatabaseConnection,
  verifyAllTables,
  getTableStats,
} from '@/services/databaseService';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface DiagnosticsState {
  connection: {
    success: boolean;
    message: string;
  } | null;
  tables: Record<string, boolean> | null;
  stats: Record<string, { count: number; error?: string }> | null;
  loading: boolean;
  error: string | null;
}

export function DatabaseTest() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsState>({
    connection: null,
    tables: null,
    stats: null,
    loading: true,
    error: null,
  });

  const runDiagnostics = async () => {
    setDiagnostics(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('[v0] Running database diagnostics...');

      // Test connection
      const connectionResult = await testDatabaseConnection();
      console.log('[v0] Connection test:', connectionResult);

      // Verify all tables
      const tablesResult = await verifyAllTables();
      console.log('[v0] Tables verification:', tablesResult);

      // Get table stats
      const statsResult = await getTableStats();
      console.log('[v0] Table stats:', statsResult);

      setDiagnostics({
        connection: {
          success: connectionResult.success,
          message: connectionResult.data || connectionResult.error || 'Unknown',
        },
        tables: tablesResult.data,
        stats: statsResult.data,
        loading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[v0] Diagnostics error:', err);
      setDiagnostics(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Database Diagnostics</h2>
        <Button onClick={runDiagnostics} disabled={diagnostics.loading}>
          {diagnostics.loading ? 'Testing...' : 'Run Diagnostics'}
        </Button>
      </div>

      {diagnostics.error && (
        <Alert variant="destructive">
          <AlertDescription>{diagnostics.error}</AlertDescription>
        </Alert>
      )}

      {/* Connection Status */}
      {diagnostics.connection && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Connection Status</h3>
          <div className={`flex items-center gap-2 ${diagnostics.connection.success ? 'text-green-600' : 'text-red-600'}`}>
            <span className={`w-3 h-3 rounded-full ${diagnostics.connection.success ? 'bg-green-600' : 'bg-red-600'}`}></span>
            <span>{diagnostics.connection.message}</span>
          </div>
        </Card>
      )}

      {/* Tables Status */}
      {diagnostics.tables && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Table Verification</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(diagnostics.tables).map(([table, accessible]) => (
              <div
                key={table}
                className={`p-2 rounded text-sm font-medium ${
                  accessible
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <span className={accessible ? '✓' : '✗'} /> {table}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Table Statistics */}
      {diagnostics.stats && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Table Statistics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-2">Table Name</th>
                  <th className="text-right p-2">Record Count</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(diagnostics.stats).map(([table, stat]) => (
                  <tr key={table} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{table}</td>
                    <td className="text-right p-2">
                      {stat.error ? (
                        <span className="text-red-600">Error</span>
                      ) : (
                        <span className="text-blue-600 font-semibold">{stat.count}</span>
                      )}
                    </td>
                    <td className="p-2 text-sm">
                      {stat.error ? (
                        <span className="text-red-500">{stat.error}</span>
                      ) : (
                        <span className="text-green-600">✓ Accessible</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Info Box */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">How to Use This</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Click "Run Diagnostics" to test your database connection</li>
          <li>Green checks (✓) mean the table is accessible</li>
          <li>Red X's (✗) mean there's a connection issue</li>
          <li>Record count shows how many items are in each table</li>
          <li>This component can be removed once you verify connection</li>
        </ul>
      </Card>

      {/* Code Example */}
      <Card className="p-4 bg-gray-50 border-gray-200">
        <h4 className="font-semibold mb-2">Example: Using Database Hooks</h4>
        <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
{`import { useProducts } from '@/hooks/useDatabase';

function ProductList() {
  const { data: products, isLoading } = useProducts();
  
  if (isLoading) return <p>Loading...</p>;
  
  return (
    <div>
      {products?.items.map(p => (
        <div key={p.id}>{p.name} - ${p.price}</div>
      ))}
    </div>
  );
}`}
        </pre>
      </Card>
    </div>
  );
}

export default DatabaseTest;
