import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { getDirectedCommittees, hasOfficerRole, type DirectedCommittee } from "./api";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  display_name: string | null;
  major: string | null;
  grad_year: number | null;
  classification: string | null;
  pronouns: string | null;
  is_admin: boolean;
  onboarded: boolean;
  discord_joined: boolean;
  instagram_joined: boolean;
  phone: string | null;
  student_id: string | null;
  discord_username: string | null;
  linkedin: string | null;
  github: string | null;
  instagram_handle: string | null;
}

interface AuthCtx {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  directedCommittees: DirectedCommittee[];
  isOfficer: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<string | null>;
  resendConfirmation: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, display_name, major, grad_year, classification, pronouns, is_admin, onboarded, discord_joined, instagram_joined, phone, student_id, discord_username, linkedin, github, instagram_handle"
    )
    .eq("id", userId)
    .single();
  if (error) return null;
  return data as Profile;
}

function humanizeError(raw: string): string {
  const msg = raw.toLowerCase();
  if (msg.includes("invalid login credentials"))
    return "Wrong email or password.";
  if (msg.includes("email not confirmed"))
    return "Check your inbox - click the confirmation link before signing in.";
  if (msg.includes("user already registered"))
    return "An account with this email already exists. Sign in instead.";
  if (
    msg.includes("database error") ||
    msg.includes("unexpected_failure") ||
    msg.includes("restricted") ||
    msg.includes("not allowed")
  )
    return "This email address is not allowed. Use your @mavs.uta.edu address.";
  if (msg.includes("password should be"))
    return "Password must be at least 6 characters.";
  return raw;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [directedCommittees, setDirectedCommittees] = useState<DirectedCommittee[]>([]);
  const [isOfficer, setIsOfficer] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const [p, directed, officer] = await Promise.all([
          fetchProfile(session.user.id),
          getDirectedCommittees(session.user.id),
          hasOfficerRole(session.user.id),
        ]);
        setProfile(p);
        setDirectedCommittees(directed);
        setIsOfficer(officer);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const [p, directed, officer] = await Promise.all([
          fetchProfile(session.user.id),
          getDirectedCommittees(session.user.id),
          hasOfficerRole(session.user.id),
        ]);
        setProfile(p);
        setDirectedCommittees(directed);
        setIsOfficer(officer);
      } else {
        setProfile(null);
        setDirectedCommittees([]);
        setIsOfficer(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? humanizeError(error.message) : null;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    return error ? humanizeError(error.message) : null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    return error ? error.message : null;
  };

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    return error ? error.message : null;
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return error ? error.message : null;
  };

  const refreshProfile = async () => {
    if (user) setProfile(await fetchProfile(user.id));
  };

  return (
    <AuthContext.Provider
      value={{
        user, profile, session, loading,
        directedCommittees, isOfficer,
        signIn, signUp, signOut,
        resetPassword, resendConfirmation,
        updatePassword, refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
