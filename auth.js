// Supabase config + auth helpers (loaded after the supabase-js UMD bundle)
const SUPABASE_URL = 'https://vboflwsbwllbdidifxzq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ilRDzMyuBb4Jfcg7tPBZ6g_5fQ-vakM';
const SUPABASE_REF = 'vboflwsbwllbdidifxzq';
const STORAGE_KEY = 'sb-' + SUPABASE_REF + '-auth-token';

const _supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, storage: window.localStorage }
});

window.AUTH = {
  client: _supa,
  storageKey: STORAGE_KEY,

  hasLocalSession() { return !!localStorage.getItem(STORAGE_KEY); },

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

  async signUp(email, password, profile) {
    return await _supa.auth.signUp({
      email, password,
      options: profile ? { data: profile } : undefined
    });
  },

  async signOut() {
    await _supa.auth.signOut();
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = 'index.html';
  },

  // Hard guard: redirect to login if no session. Call early.
  async requireAuth() {
    if (!this.hasLocalSession()) { window.location.replace('login.html'); return null; }
    const s = await this.session();
    if (!s) { window.location.replace('login.html'); return null; }
    return s;
  },

  // For login/register pages: redirect to app if already logged in
  async redirectIfAuthed() {
    if (!this.hasLocalSession()) return;
    const s = await this.session();
    if (s) window.location.replace('app.html');
  }
};
