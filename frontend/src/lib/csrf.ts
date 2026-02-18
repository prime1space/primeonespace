// frontend/src/lib/csrf.ts

import { baseURL } from './auth-client';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Fetch a new CSRF token from the backend
 */
export async function fetchCSRFToken(): Promise<string> {
    try {
        // Return cached token if still valid (with 5 min buffer)
        if (cachedToken && Date.now() < tokenExpiry - 300000) {
            return cachedToken;
        }

        const response = await fetch(`${baseURL}/csrf-token.php`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('bearer_token') ?? ''}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch CSRF token');
        }

        const data = await response.json();
        cachedToken = data.token;
        tokenExpiry = Date.now() + (data.expiresIn * 1000);

        return cachedToken || '';
    } catch (error) {
        console.error('CSRF token fetch error:', error);
        // Return empty string on error - backend will handle validation
        return '';
    }
}

/**
 * Clear cached CSRF token (e.g., on logout)
 */
export function clearCSRFToken() {
    cachedToken = null;
    tokenExpiry = 0;
}

/**
 * Add CSRF token to fetch headers
 */
export async function getCSRFHeaders(): Promise<HeadersInit> {
    const token = await fetchCSRFToken();
    return {
        'X-CSRF-Token': token
    };
}

/**
 * Wrapper for fetch with automatic CSRF token inclusion
 */
export async function fetchWithCSRF(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const csrfHeaders = await getCSRFHeaders();

    const headers = {
        ...options.headers,
        ...csrfHeaders
    };

    return fetch(url, {
        ...options,
        headers
    });
}
