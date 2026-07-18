"use client";

import { useEffect, useState } from "react";

type TypewriterOptions = {
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseMs?: number;
};

function prefersReducedMotion() {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useTypewriter(items: string[], options: TypewriterOptions = {}) {
    const { typingSpeed = 70, deletingSpeed = 40, pauseMs = 1400 } = options;

    const [itemIndex, setItemIndex] = useState(0);
    const [text, setText] = useState(items[0] ?? "");
    const [isDeleting, setIsDeleting] = useState(false);
    const [reducedMotion] = useState(prefersReducedMotion);

    useEffect(() => {
        if (items.length === 0 || reducedMotion) return;

        const current = items[itemIndex];
        let delay: number;

        if (!isDeleting && text === current) {
            delay = pauseMs;
        } else if (isDeleting && text === "") {
            delay = typingSpeed;
        } else {
            delay = isDeleting ? deletingSpeed : typingSpeed;
        }

        const timeout = setTimeout(() => {
            if (!isDeleting && text === current) {
                setIsDeleting(true);
                return;
            }

            if (isDeleting && text === "") {
                setIsDeleting(false);
                setItemIndex((i) => (i + 1) % items.length);
                return;
            }

            const nextLength = text.length + (isDeleting ? -1 : 1);
            setText(current.slice(0, nextLength));
        }, delay);

        return () => clearTimeout(timeout);
    }, [text, isDeleting, itemIndex, items, typingSpeed, deletingSpeed, pauseMs, reducedMotion]);

    return text;
}
