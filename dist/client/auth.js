// Supabase config + auth helpers (loaded after the supabase-js UMD bundle)
const SUPABASE_URL = 'https://vboflwsbwllbdidifxzq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ilRDzMyuBb4Jfcg7tPBZ6g_5fQ-vakM';
const SUPABASE_REF = 'vboflwsbwllbdidifxzq';
const STORAGE_KEY = 'sb-' + SUPABASE_REF + '-auth-token';
const DEMO_EMAIL = 'demo@mach.bank';
const DEMO_PASSWORD = 'MachDemo!2026';

const _supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, storage: window.localStorage }
});

window.AUTH = {
  client: _supa,
  storageKey: STORAGE_KEY,
  demoCredentials: Object.freeze({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),

  hasLocalSession() { return !!localStorage.getItem(STORAGE_KEY); },

  // Authorization decisions for the shared demo account must use the signed
  // app_metadata claim returned by getUser(), never an email, query string or
  // localStorage flag.
  isDemoUser(user) {
    return !!(user && user.app_metadata && (
      user.app_metadata.is_demo === true ||
      user.app_metadata.is_demo === 'true'
    ));
  },

  async session() {
    const { data: { session } } = await _supa.auth.getSession();
    return session;
  },

  async user() {
    const { data: { user } } = await _supa.auth.getUser();
    return user;
  },

  async signIn(email, password) {
    return await _supa.auth.signInWithPassword({ email, password });
  },

  async signInDemo() {
    return await _supa.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD
    });
  },

  async signUp(email, password, profile) {
    return await _supa.auth.signUp({
      email, password,
      options: profile ? { data: profile } : undefined
    });
  },

  async signOut(redirectTo, scope) {
    let currentUser = null;
    try { currentUser = await this.user(); } catch (_) {}
    // The demo is a shared account: a global sign-out would invalidate every
    // visitor's refresh token. Always terminate only this browser session.
    const signOutScope = this.isDemoUser(currentUser) ? 'local' : (scope || 'local');
    await _supa.auth.signOut({ scope: signOutScope });
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = redirectTo || 'index.html';
  },

  // Hard guard: redirect to login if no session. Call early.
  // Uses getSession() which handles OAuth URL hash parsing on first load.
  async requireAuth() {
    const s = await this.session();
    if (!s) { window.location.replace('login.html'); return null; }
    return s;
  },

  // For login/register pages: redirect to app if already logged in.
  // Also redirects when OAuth callback hash is present (post-Google login).
  async redirectIfAuthed() {
    const s = await this.session();
    if (s) window.location.replace('app.html');
  }
};
