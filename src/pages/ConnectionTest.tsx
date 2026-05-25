import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";

interface TestResult {
  name: string;
  status: "pending" | "success" | "error";
  message: string;
  details?: string;
}

export default function ConnectionTest() {
  const [results, setResults] = useState<TestResult[]>([
    {
      name: "Supabase Connection",
      status: "pending",
      message: "Testing connection...",
    },
    {
      name: "Orders Table",
      status: "pending",
      message: "Testing access...",
    },
    {
      name: "Profiles Table",
      status: "pending",
      message: "Testing access...",
    },
    {
      name: "Products Table",
      status: "pending",
      message: "Testing access...",
    },
  ]);

  const runTests = async () => {
    setResults((prev) =>
      prev.map((r) => ({ ...r, status: "pending", message: "Testing..." }))
    );

    const newResults: TestResult[] = [];

    // Test 1: Supabase Connection
    try {
      const { data, error } = await supabase.from("orders").select("count", { count: "exact" });
      if (error) throw error;
      
      newResults.push({
        name: "Supabase Connection",
        status: "success",
        message: "Connected successfully",
        details: `URL: ${import.meta.env.VITE_SUPABASE_URL}`,
      });
    } catch (error: any) {
      newResults.push({
        name: "Supabase Connection",
        status: "error",
        message: "Connection failed",
        details: error.message,
      });
    }

    // Test 2: Orders Table
    try {
      const { count, error } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      
      newResults.push({
        name: "Orders Table",
        status: "success",
        message: "Table accessible",
        details: `Found ${count || 0} records`,
      });
    } catch (error: any) {
      newResults.push({
        name: "Orders Table",
        status: "error",
        message: "Cannot access table",
        details: error.message,
      });
    }

    // Test 3: Profiles Table
    try {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      
      newResults.push({
        name: "Profiles Table",
        status: "success",
        message: "Table accessible",
        details: `Found ${count || 0} records`,
      });
    } catch (error: any) {
      newResults.push({
        name: "Profiles Table",
        status: "error",
        message: "Cannot access table",
        details: error.message,
      });
    }

    // Test 4: Products Table
    try {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      
      newResults.push({
        name: "Products Table",
        status: "success",
        message: "Table accessible",
        details: `Found ${count || 0} records`,
      });
    } catch (error: any) {
      newResults.push({
        name: "Products Table",
        status: "error",
        message: "Cannot access table",
        details: error.message,
      });
    }

    setResults(newResults);
  };

  useEffect(() => {
    runTests();
  }, []);

  const allSuccess = results.every((r) => r.status === "success");

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Supabase Connection Test</h1>
          <p className="text-muted-foreground mt-2">
            Verifying your database connection and table accessibility
          </p>
        </div>

        {/* Overall Status */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>All systems check</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {allSuccess ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <span className="text-lg font-semibold text-green-600">All Connected</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8 text-red-500" />
                    <span className="text-lg font-semibold text-red-600">Check Errors</span>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Test Results */}
        <div className="space-y-4 mb-6">
          {results.map((result, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {result.status === "pending" && (
                      <Loader2 className="w-5 h-5 text-amber-500 animate-spin mt-0.5 flex-shrink-0" />
                    )}
                    {result.status === "success" && (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    )}
                    {result.status === "error" && (
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{result.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                      {result.details && (
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-xs text-muted-foreground font-mono">
                            {result.details}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Badge
                    variant={
                      result.status === "success"
                        ? "default"
                        : result.status === "error"
                        ? "destructive"
                        : "secondary"
                    }
                    className="mt-0.5 flex-shrink-0"
                  >
                    {result.status === "pending"
                      ? "Testing..."
                      : result.status === "success"
                      ? "Pass"
                      : "Fail"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Environment Info */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-sm">Environment Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Supabase URL:</span>
              <span className="text-foreground">{import.meta.env.VITE_SUPABASE_URL}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">API Key:</span>
              <span className="text-foreground">
                {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.substring(0, 20)}...
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={runTests} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Run Tests Again
          </Button>
          {allSuccess && (
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              Go to Dashboard
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold text-sm mb-2">What this test does:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Checks if Supabase can be reached</li>
            <li>✓ Verifies access to your orders table</li>
            <li>✓ Verifies access to your profiles table</li>
            <li>✓ Verifies access to your products table</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
