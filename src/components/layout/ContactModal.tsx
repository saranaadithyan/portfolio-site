"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { site } from "@/data/site";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

type Status = "idle" | "loading" | "success" | "error";

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function ContactModal({ open, onClose }: ContactModalProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [prevOpen, setPrevOpen] = useState(open);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [everOpened, setEverOpened] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setEverOpened(true);
    if (!open) {
      setStatus("idle");
      setErrorMessage(null);
    }
  }

  useEffect(() => {
    if (!open && closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const pendingRef = useRef<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
  } | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const formVisible = open && status !== "success";

  // Render the invisible widget whenever the form is on screen. The modal unmounts its
  // children when closed, so the widget has to be re-created on each open.
  useEffect(() => {
    const container = containerRef.current;
    if (!formVisible || !scriptReady || !container || !recaptchaSiteKey) return;

    window.grecaptcha?.ready(() => {
      if (!containerRef.current || widgetIdRef.current !== null) return;
      widgetIdRef.current = window.grecaptcha!.render(containerRef.current, {
        sitekey: recaptchaSiteKey,
        size: "invisible",
        callback: (token) => {
          pendingRef.current?.resolve(token);
          pendingRef.current = null;
        },
        "error-callback": () => {
          pendingRef.current?.reject(
            new Error("reCAPTCHA verification failed"),
          );
          pendingRef.current = null;
        },
      });
    });

    return () => {
      widgetIdRef.current = null;
    };
  }, [formVisible, scriptReady]);

  function getRecaptchaToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha || widgetIdRef.current === null) {
        reject(new Error("reCAPTCHA verification failed"));
        return;
      }
      // An invisible challenge that the user dismisses never calls back, so time out.
      const timeout = setTimeout(() => {
        pendingRef.current = null;
        reject(new Error("reCAPTCHA verification failed"));
      }, 60_000);
      pendingRef.current = {
        resolve: (token) => {
          clearTimeout(timeout);
          resolve(token);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        },
      };
      window.grecaptcha.execute(widgetIdRef.current);
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!recaptchaSiteKey) {
      setStatus("error");
      setErrorMessage(
        "The contact form is unavailable right now. Please email me instead.",
      );
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      const token = await getRecaptchaToken();
      const data = Object.fromEntries(new FormData(form));

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token }),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(
          result?.error ?? "Something went wrong sending your message.",
        );
      }

      setStatus("success");
      form.reset();
      closeTimeoutRef.current = setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message === "reCAPTCHA verification failed"
            ? "reCAPTCHA verification failed. Please try again."
            : error.message
          : null,
      );
    } finally {
      if (widgetIdRef.current !== null)
        window.grecaptcha?.reset(widgetIdRef.current);
    }
  }

  const isLoading = status === "loading";

  return (
    <>
      {recaptchaSiteKey && everOpened ? (
        <Script
          src="https://www.google.com/recaptcha/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
          onError={() => setScriptReady(false)}
        />
      ) : null}
      <Modal open={open} onClose={onClose} title="Get in touch">
        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ECECEC] text-2xl">
              ✅
            </span>
            <p className="text-lg font-semibold text-[#282929]">
              Message sent!
            </p>
            <p className="text-sm text-[#7C7D80]">
              Thanks for reaching out — I&apos;ll get back to you soon.
            </p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {status === "error" ? (
              <div
                role="alert"
                className="flex items-center justify-between gap-3 rounded-lg border border-[#27272A]/20 bg-[#F8F8F8] px-4 py-3 text-sm text-[#444444]"
              >
                <span>
                  {errorMessage ?? "Something went wrong sending your message."}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setErrorMessage(null);
                  }}
                  className="font-medium text-[#333333] underline underline-offset-2 hover:text-[#282929]"
                >
                  Try again
                </button>
              </div>
            ) : null}

            <fieldset disabled={isLoading} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" name="name" type="text" />
                <Field label="Email" name="email" type="email" />
              </div>
              <Field label="Subject" name="subject" type="text" />
              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-[#282929]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full rounded-lg border border-[#27272A]/20 bg-white px-3 py-2 text-sm text-[#444444] outline-none focus-visible:border-[#333333] disabled:opacity-60"
                />
              </div>
            </fieldset>

            {/* Honeypot: hidden from people, filled in by bots. */}
            <div
              aria-hidden
              className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
            >
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div ref={containerRef} />

            <p className="text-xs text-[#7C7D80]">
              Protected by reCAPTCHA. Google&apos;s{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                Terms of Service
              </a>{" "}
              apply.
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !recaptchaSiteKey}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <span
                      aria-hidden
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    />
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 flex flex-wrap gap-4 border-t border-[#27272A]/10 pt-4 text-sm text-[#7C7D80]">
          <a href={`mailto:${site.email}`} className="hover:text-[#333333]">
            {site.email}
          </a>
          <a
            href={site.social.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#333333]"
          >
            GitHub
          </a>
          <a
            href={site.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#333333]"
          >
            LinkedIn
          </a>
        </div>
      </Modal>
    </>
  );
}

function Field({
  label,
  name,
  type,
}: {
  label: string;
  name: string;
  type: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium text-[#282929]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="w-full rounded-lg border border-[#27272A]/20 bg-white px-3 py-2 text-sm text-[#444444] outline-none focus-visible:border-[#333333] disabled:opacity-60"
      />
    </div>
  );
}
