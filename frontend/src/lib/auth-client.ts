"use client"
import { createAuthClient } from "better-auth/react"
import { useEffect, useState, useRef } from "react"

const getBaseURL = () => {
   const envURL = process.env.NEXT_PUBLIC_API_URL;
   if (envURL) return envURL.replace(/\/$/, "");

   if (typeof window !== 'undefined') {
      if (window.location.hostname.includes('primeone.space') || window.location.hostname.includes('primeone.global')) {
         // On cPanel: use router.php directly (htaccess rewrites don't work with static frontend)
         return `${window.location.origin}/php/api/router.php`;
      }
      return window.location.origin;
   }
   return '';
};

export const baseURL = getBaseURL();
if (typeof window !== 'undefined') {
   console.log("Auth Client connecting to:", baseURL);
}

export const authClient = createAuthClient({
   baseURL: baseURL,
   fetchOptions: {
      headers: {
         Authorization: `Bearer ${typeof window !== 'undefined' ? (localStorage.getItem("bearer_token") || "") : ""}`,
      },
      onSuccess: (ctx) => {
         const authToken = ctx.response.headers.get("set-auth-token")
         if (authToken) {
            console.log("Token received, storing in localStorage:", authToken);
            localStorage.setItem("bearer_token", authToken);
         }
      }
   }
});

type SessionData = ReturnType<typeof authClient.useSession>

export function useSession(): SessionData {
   const [session, setSession] = useState<any>(null);
   const [isPending, setIsPending] = useState(true);
   const [error, setError] = useState<any>(null);
   const sessionRef = useRef(session);

   useEffect(() => {
      sessionRef.current = session;
   }, [session]);

   const refetch = () => {
      setIsPending(true);
      setError(null);
      fetchSession();
   };

   const fetchSession = async () => {
      try {
         const token = typeof window !== 'undefined' ? localStorage.getItem("bearer_token") || "" : "";

         if (!token) {
            setSession(null);
            setError(null);
            setIsPending(false);
            return;
         }

         console.log("Fetching session with token:", token.substring(0, 10) + "...");

         const response = await fetch(`${baseURL}/auth/get-session`, {
            method: 'GET',
            headers: {
               "Authorization": `Bearer ${token}`,
               "Content-Type": "application/json"
            }
         });

         if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
         }

         const data = await response.json();
         console.log("Session response:", data);

         if (data.user) {
            setSession(data);
            setError(null);
         } else {
            setSession(null);
            setError(null);
            // Clear invalid token
            localStorage.removeItem("bearer_token");
         }
      } catch (err) {
         console.error("Session fetch error:", err);
         setSession(null);
         setError(err);
         // Clear invalid token on error
         if (typeof window !== 'undefined') {
            localStorage.removeItem("bearer_token");
         }
      } finally {
         setIsPending(false);
      }
   };

   useEffect(() => {
      fetchSession();

      const handleStorageChange = () => {
         fetchSession();
      };

      window.addEventListener('storage', handleStorageChange);

      // Polling for token presence (helpful for redirects where storage event might not fire)
      const interval = setInterval(() => {
         const token = localStorage.getItem("bearer_token");
         if (token && !sessionRef.current) {
            fetchSession();
         }
      }, 500);

      return () => {
         window.removeEventListener('storage', handleStorageChange);
         clearInterval(interval);
      }
   }, []);

   return { data: session, isPending, isRefetching: false, error, refetch: async () => await refetch() } as any;
}