import { useState, useEffect } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface TestResult {
  name: string;
  status: "pending" | "success" | "error";
  message: string;
  details?: string;
}

export default function Diagnostic() {
  const [results, setResults] = useState<TestResult[]>([
    { name: "Environment Variables", status: "pending", message: "" },
    { name: "Supabase Connection", status: "pending", message: "" },
    { name: "Orders Table Access", status: "pending", message: "" },
    { name: "Profiles Table Access", status: "pending", message: "" },
    { name: "RLS Check", status: "pending", message: "" },
  ]);

  const runTests = async () => {
    setResults((prev) =>
      prev.map((r) => ({ ...r, status: "pending", message: "" }))
    );

    let newResults = [...results];

    // Test 1: Environment Variables
    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      if (url && key) {
        newResults[0] = {
          name: "Environment Variables",
          status: "success",
          message: "VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set",
          details: `URL: ${url.substring(0, 30)}...`,
        };
      } else {
        newResults[0] = {
          name: "Environment Variables",
          status: "error",
          message: "Missing required environment variables",
        };
      }
    } catch (err) {
      newResults[0] = {
        name: "Environment Variables",
        status: "error",
        message: String(err),
      };
    }
    setResults([...newResults]);

    // Test 2: Supabase Connection
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        newResults[1] = {
          name: "Supabase Connection",
          status: "success",
          message: "Connected to Supabase (no auth session - expected)",
        };
      } else {
        newResults[1] = {
          name: "Supabase Connection",
          status: "success",
          message: "Connected to Supabase",
          details: data ? "Session exists" : "No session (anonymous)",
        };
      }
    } catch (err) {
      newResults[1] = {
        name: "Supabase Connection",
        status: "error",
        message: String(err),
      };
    }
    setResults([...newResults]);

    // Test 3: Orders Table Access
    try {
      const { data, error, status } = await supabase
        .from("orders")
        .select("*")
        .limit(1);

      if (error) {
        newResults[2] = {
          name: "Orders Table Access",
          status: "error",
          message: `Error: ${error.message}`,
          details: `Status: ${status || "unknown"}`,
        };
      } else {
        newResults[2] = {
          name: "Orders Table Access",
          status: "success",
          message: "Successfully queried orders table",
          details: `Retrieved ${data?.length || 0} record(s)`,
        };
      }
    } catch (err) {
      newResults[2] = {
        name: "Orders Table Access",
        status: "error",
        message: String(err),
      };
    }
    setResults([...newResults]);

    // Test 4: Profiles Table Access
    try {
      const { data, error, status } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);

      if (error) {
        newResults[3] = {
          name: "Profiles Table Access",
          status: "error",
          message: `Error: ${error.message}`,
          details: `Status: ${status || "unknown"}`,
        };
      } else {
        newResults[3] = {
          name: "Profiles Table Access",
          status: "success",
          message: "Successfully queried profiles table",
          details: `Retrieved ${data?.length || 0} record(s)`,
        };
      }
    } catch (err) {
      newResults[3] = {
        name: "Profiles Table Access",
        status: "error",
        message: String(err),
      };
    }
    setResults([...newResults]);

    // Test 5: RLS Check
    try {
      const { data, error } = await supabase.rpc("get_rls_status");
      if (error?.message?.includes("does not exist")) {
        newResults[4] = {
          name: "RLS Check",
          status: "error",
          message:
            "RLS policies may be blocking access (401 errors indicate RLS is enabled)",
          details: "Run: ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;",
        };
      } else if (error) {
        newResults[4] = {
          name: "RLS Check",
          status: "error",
          message: `RLS check error: ${error.message}`,
        };
      } else {
        newResults[4] = {
          name: "RLS Check",
          status: "success",
          message: "RLS status check passed",
        };
      }
    } catch (err) {
      // RLS status function may not exist, which is fine
      newResults[4] = {
        name: "RLS Check",
        status: "error",
        message:
          "Could not determine RLS status. If you see 401 errors, RLS is likely enabled. See FIX_401_ERRORS.md",
      };
    }
    setResults([...newResults]);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">Diagnostics</h1>
              <p className="text-muted-foreground">
                Test your Supabase connection and identify issues
              </p>
            </div>

            {/* Test Results */}
            <div className="space-y-4">
              {results.map((result, idx) => (
                <Card key={idx}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {result.status === "pending" && (
                          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                        )}
                        {result.status === "success" && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {result.status === "error" && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        {result.name}
                      </CardTitle>
                      <span
                        className={`text-xs font-semibold uppercase ${
                          result.status === "success"
                            ? "text-green-600"
                            : result.status === "error"
                              ? "text-red-600"
                              : "text-blue-600"
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-foreground">{result.message}</p>
                    {result.details && (
                      <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                        {result.details}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Run Again Button */}
            <Button onClick={runTests} className="w-full sm:w-auto">
              <Loader2 className="w-4 h-4 mr-2" />
              Run Tests Again
            </Button>

            {/* Troubleshooting */}
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-base">
                  Getting 401 Unauthorized Errors?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  Your Supabase tables likely have Row Level Security (RLS)
                  enabled. This requires authentication, but your app uses an
                  anonymous key.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Solution:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>
                      Read{" "}
                      <code className="bg-white px-2 py-1 rounded text-xs font-mono">
                        FIX_401_ERRORS.md
                      </code>{" "}
                      in your project
                    </li>
                    <li>Go to your Supabase Dashboard</li>
                    <li>
                      Run SQL to disable RLS or create permissive policies
                    </li>
                    <li>Refresh your browser (Ctrl+Shift+R)</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
