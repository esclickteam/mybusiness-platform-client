import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  clearStoredSiteMemberToken,
  fetchSiteMemberMe,
  getStoredSiteMemberToken,
  siteMemberLogin,
  siteMemberLogout,
  siteMemberRegister,
  type SiteMemberProfile,
} from "../api/siteMemberAuthApi";

type SiteMemberAuthContextValue = {
  slug: string;
  member: SiteMemberProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (login: string, password: string) => Promise<void>;
  register: (payload: {
    email?: string;
    username?: string;
    password: string;
    displayName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const SiteMemberAuthContext = createContext<SiteMemberAuthContextValue | null>(
  null
);

type SiteMemberAuthProviderProps = {
  slug: string;
  children: React.ReactNode;
};

export function SiteMemberAuthProvider({
  slug,
  children,
}: SiteMemberAuthProviderProps) {
  const [member, setMember] = useState<SiteMemberProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!slug) {
      setMember(null);
      setLoading(false);
      return;
    }

    const token = getStoredSiteMemberToken(slug);
    if (!token) {
      setMember(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchSiteMemberMe(slug);
      setMember(data.member);
    } catch {
      clearStoredSiteMemberToken(slug);
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (loginValue: string, password: string) => {
      const data = await siteMemberLogin(slug, loginValue, password);
      setMember(data.member);
    },
    [slug]
  );

  const register = useCallback(
    async (payload: {
      email?: string;
      username?: string;
      password: string;
      displayName?: string;
    }) => {
      const data = await siteMemberRegister(slug, payload);
      setMember(data.member);
    },
    [slug]
  );

  const logout = useCallback(async () => {
    await siteMemberLogout(slug);
    setMember(null);
  }, [slug]);

  const value = useMemo(
    () => ({
      slug,
      member,
      loading,
      isAuthenticated: Boolean(member),
      login,
      register,
      logout,
      refresh,
    }),
    [slug, member, loading, login, register, logout, refresh]
  );

  return (
    <SiteMemberAuthContext.Provider value={value}>
      {children}
    </SiteMemberAuthContext.Provider>
  );
}

export function useSiteMemberAuth() {
  const context = useContext(SiteMemberAuthContext);
  if (!context) {
    throw new Error("useSiteMemberAuth must be used within SiteMemberAuthProvider");
  }
  return context;
}

export function useOptionalSiteMemberAuth() {
  return useContext(SiteMemberAuthContext);
}
