"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { site } from "@/data/site";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

type Status = "idle" | "loading" | "success" | "error";

export function ContactModal({ open, onClose }: ContactModalProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [prevOpen, setPrevOpen] = useState(open);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) setStatus("idle");
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    setTimeout(() => {
      try {
        setStatus("success");
        closeTimeoutRef.current = setTimeout(() => {
          onClose();
        }, 1500);
      } catch {
        setStatus("error");
      }
    }, 900);
  }

  const isLoading = status === "loading";

  return (
    <Modal open={open} onClose={onClose} title="Get in touch">
      {status === "success" ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ECECEC] text-2xl">
            ✅
          </span>
          <p className="text-lg font-semibold text-[#282929]">Message sent!</p>
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
              <span>😞 Something went wrong sending your message.</span>
              <button
                type="button"
                onClick={() => setStatus("idle")}
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
              <label htmlFor="message" className="text-sm font-medium text-[#282929]">
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
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
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
        <a href={site.social.github} target="_blank" rel="noreferrer" className="hover:text-[#333333]">
          GitHub
        </a>
        <a href={site.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#333333]">
          LinkedIn
        </a>
      </div>
    </Modal>
  );
}

function Field({ label, name, type }: { label: string; name: string; type: string }) {
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
