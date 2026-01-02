import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

type Profile = {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  user_type: string;
};

type User = {
  id: string;
  email: string;
};

type Session = {
  user: User;
} | null;

interface AuthContextType {
  user: User | null;
  session: Session;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'miskinerbasa_users';
const PROFILES_KEY = 'miskinerbasa_profiles';
const SESSION_KEY = 'miskinerbasa_session';

const readJson = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
};

const writeJson = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = readJson<{ user: User }>(SESSION_KEY);
    if (saved?.user) {
      setUser(saved.user);
      setSession({ user: saved.user });
      const profiles = readJson<Profile[]>(PROFILES_KEY) || [];
      const p = profiles.find((x) => x.user_id === saved.user.id) || null;
      setProfile(p);
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // This is a frontend-only mock: store user and profile locally.
      const users = readJson<User[]>(USERS_KEY) || [];
      if (users.find((u) => u.email === email)) {
        return { error: new Error('Email already registered') };
      }

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const newUser: User = { id, email };
      users.push(newUser);
      writeJson(USERS_KEY, users);

      const profiles = readJson<Profile[]>(PROFILES_KEY) || [];
      const newProfile: Profile = {
        id: `${id}-profile`,
        user_id: id,
        full_name: fullName,
        phone: null,
        avatar_url: null,
        user_type: 'owner',
      };
      profiles.push(newProfile);
      writeJson(PROFILES_KEY, profiles);

      const sessionObj = { user: newUser };
      writeJson(SESSION_KEY, sessionObj);
      setUser(newUser);
      setSession(sessionObj);
      setProfile(newProfile);

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Sign up failed') };
    }
  };

  const signIn = async (email: string, _password: string) => {
    try {
      const users = readJson<User[]>(USERS_KEY) || [];
      const found = users.find((u) => u.email === email);
      if (!found) return { error: new Error('User not found') };

      const sessionObj = { user: found };
      writeJson(SESSION_KEY, sessionObj);
      setUser(found);
      setSession(sessionObj);

      const profiles = readJson<Profile[]>(PROFILES_KEY) || [];
      const p = profiles.find((x) => x.user_id === found.id) || null;
      setProfile(p);

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Sign in failed') };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const profiles = readJson<Profile[]>(PROFILES_KEY) || [];
      const idx = profiles.findIndex((p) => p.user_id === user.id);
      if (idx === -1) return { error: new Error('Profile not found') };

      profiles[idx] = { ...profiles[idx], ...updates };
      writeJson(PROFILES_KEY, profiles);
      setProfile(profiles[idx]);

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Update failed') };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, profile, loading, signUp, signIn, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
