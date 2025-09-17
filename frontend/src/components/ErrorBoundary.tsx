// src/components/ErrorBoundary.tsx
import React, { Component, type ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        // Update state เพื่อ render fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // คุณสามารถส่ง log ไป server ได้ตรงนี้
        console.error("Caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    <h1>เกิดข้อผิดพลาด 😵</h1>
                    <p>{this.state.error?.message || "มีบางอย่างผิดพลาด"}</p>
                    <button onClick={() => window.location.reload()}>ลองโหลดใหม่</button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
