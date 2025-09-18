import { useQuery, useMutation } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export const useConvexQuery = (query, ...args) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Only attempt query if we have auth and query
  const shouldQuery = isSignedIn && isLoaded && query;
  const queryResult = useQuery(
    shouldQuery ? query : null,
    ...(shouldQuery ? args : [])
  );

  useEffect(() => {
    let isMounted = true;

    const processQueryResult = () => {
      if (!isMounted) return;

      if (!isLoaded) {
        setIsLoading(true);
        return;
      }

      if (!isSignedIn) {
        setData(undefined);
        setError(new Error("Please sign in to continue"));
        setIsLoading(false);
        return;
      }

      if (!query) {
        setError(new Error("No query provided"));
        setIsLoading(false);
        return;
      }

      if (queryResult === undefined) {
        setIsLoading(true);
      } else {
        try {
          setData(queryResult);
          setError(null);
        } catch (err) {
          console.error("Query error:", err);
          setError(err);
          toast.error("Failed to load data");
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };

    processQueryResult();

    return () => {
      isMounted = false;
    };
  }, [queryResult, isSignedIn, isLoaded, query]);

  return {
    data,
    isLoading: isLoading || !isLoaded,
    error,
    isAuthenticated: isSignedIn && isLoaded,
    refetch: queryResult?._refetch,
  };
};

export const useConvexMutation = (mutation) => {
  const { isSignedIn, isLoaded } = useAuth();
  const mutationFn = useMutation(mutation);
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (...args) => {
      if (!isLoaded) {
        throw new Error("Authentication is loading");
      }

      if (!isSignedIn) {
        const authError = new Error("Authentication required");
        toast.error(authError.message);
        throw authError;
      }

      if (!mutation) {
        throw new Error("No mutation provided");
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await mutationFn(...args);
        setData(response);
        return response;
      } catch (err) {
        const errorMessage = err?.message || "An error occurred";
        setError(err);
        toast.error(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isSignedIn, isLoaded, mutation, mutationFn]
  );

  return {
    mutate,
    data,
    isLoading,
    error,
    isAuthenticated: isSignedIn && isLoaded,
  };
};
