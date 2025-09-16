import { type ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils"; // ของ shadcn

interface HeadProps {
    title?: string;
    children?: ReactNode; // meta, link, script อื่น ๆ
    className?: string;
}

export function Head({ title, children, className }: HeadProps) {
    useEffect(() => {
        if (title) document.title = title;
    }, [title]);

    useEffect(() => {
        if (!children) return;

        const head = document.head;
        const elements: ChildNode[] = [];

        // append JSX children เข้า head
        const container = document.createElement("div");
        container.className = cn(className);
        container.append(...(Array.isArray(children) ? children as unknown as Node[] : [children as unknown as Node]));
        Array.from(container.childNodes).forEach(el => {
            head.appendChild(el);
            elements.push(el);
        });

        return () => {
            elements.forEach(el => head.removeChild(el));
        };
    }, [children, className]);

    return null;
}
