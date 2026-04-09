import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { baseURL } from "@/lib/auth-client";
import { useState } from "react";

interface GoogleAuthButtonProps {
    onSuccess?: () => void;
    redirectTo?: string;
}

export function GoogleAuthButton({ onSuccess, redirectTo }: GoogleAuthButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        try {
            const { credential } = credentialResponse;

            // Send the Google JWT token to your PHP backend
            const res = await fetch(`${baseURL}/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: credential }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.message || "Google auth failed");
            }

            // Store the token
            const token = res.headers.get("set-auth-token") || data.token;
            if (token) {
                localStorage.setItem("bearer_token", token);
            }

            toast.success("Logged in with Google!");

            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                } else if (redirectTo) {
                    window.location.href = redirectTo;
                } else {
                    window.location.href = "/dashboard";
                }
            }, 500);

        } catch (error: any) {
            console.error("Google login error:", error);
            toast.error(error.message || "An error occurred with Google Login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`w-full flex justify-center ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => {
                    console.error("Google Sign-in failed");
                    toast.error("Google Sign-in failed. Please try again.");
                }}
                useOneTap
                theme="outline"
                shape="rectangular"
                text="signin_with"
                size="large"
                width="100%"
            />
        </div>
    );
}
