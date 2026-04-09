// Auth layout — no navigation bar or footer so they don't overlap full-screen auth pages
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
