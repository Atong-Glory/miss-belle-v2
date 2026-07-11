"use client";

import { I18nProvider, useI18n } from "@/lib/i18n";
import { WhisperProvider } from "@/components/whispering-ink";

function InnerProviders({ children }: { children: React.ReactNode }) {
  const { lang } = useI18n();

  return (
    <WhisperProvider lang={lang}>
      {children}
    </WhisperProvider>
  );
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <InnerProviders>{children}</InnerProviders>
    </I18nProvider>
  );
}
