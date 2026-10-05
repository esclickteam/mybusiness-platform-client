import React from "react";
import { Loader2 } from "lucide-react";
import type { SocialProvider } from "./authConfig";
import type { WaAuthCopy } from "./copy";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 23 23" aria-hidden="true">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M12 1h10v10H12z" />
      <path fill="#00A4EF" d="M1 12h10v10H1z" />
      <path fill="#FFB900" d="M12 12h10v10H12z" />
    </svg>
  );
}

const ICONS: Record<SocialProvider, () => React.ReactElement> = {
  google: GoogleIcon,
  facebook: FacebookIcon,
  microsoft: MicrosoftIcon,
};

const ORDER: SocialProvider[] = ["google", "facebook", "microsoft"];

type Props = {
  providers: SocialProvider[];
  copy: WaAuthCopy;
  busy: SocialProvider | "email" | null;
  onStart: (provider: SocialProvider) => void;
};

/** Configured providers plus the "OR" divider; renders nothing when none are configured. */
export default function SocialAuthButtons({ providers, copy, busy, onStart }: Props) {
  const shown = ORDER.filter((p) => providers.includes(p));
  if (!shown.length) return null;
  return (
    <>
      <div className="wa-auth-providers">
        {shown.map((provider) => {
          const Icon = ICONS[provider];
          return (
            <button
              key={provider}
              type="button"
              className="wa-auth-provider"
              data-provider={provider}
              disabled={busy !== null}
              aria-busy={busy === provider || undefined}
              onClick={() => onStart(provider)}
            >
              {busy === provider ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Icon />}
              <span>{busy === provider ? copy.redirecting : copy.providers[provider]}</span>
            </button>
          );
        })}
      </div>
      <div className="wa-auth-divider" role="separator">
        <span>{copy.or}</span>
      </div>
    </>
  );
}
