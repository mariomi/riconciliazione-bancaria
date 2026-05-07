# Mach.bank — Email Templates

6 template HTML eleganti coordinati con il brand Mach.bank, da incollare nel
Dashboard Supabase per sostituire i template default (verbosi e poco curati).

## Stile

- **Layout**: card singola 560px max-width centrata su sfondo cream `#faf9f4`
- **Tipografia**: titoli in Georgia (fallback Times New Roman) per riprendere
  Instrument Serif del sito; corpo in system stack (San Francisco / Helvetica)
- **Colori**: nero `#1c1c1c` / muted `#8b8a85` / linea `#ececea` — gli stessi
  del CSS di `index.html`
- **CTA**: bottone nero pieno, padding generoso, border-radius 8
- **Mobile-friendly**: max-width responsive, padding ridotto, testi leggibili
- **Inline CSS**: niente `<style>` perché Gmail/Outlook lo strippano. Tutti gli
  stili sono inline su ogni elemento.

## Mappatura Supabase → file

Apri il Dashboard:
👉 https://supabase.com/dashboard/project/vboflwsbwllbdidifxzq/auth/templates

Per ogni template seleziona dalla sidebar e incolla il contenuto del file
corrispondente nel campo "Message Body":

| Sidebar Supabase | File | Subject suggerito |
|---|---|---|
| **Confirm signup** | `confirm-signup.html` | `Conferma la tua email — Mach.bank` |
| **Invite user** | `invite-user.html` | `Sei stato invitato su Mach.bank` |
| **Magic Link** | `magic-link.html` | `Il tuo link di accesso a Mach.bank` |
| **Change Email Address** | `change-email.html` | `Conferma il cambio email — Mach.bank` |
| **Reset Password** | `reset-password.html` | `Reimposta la tua password — Mach.bank` |
| **Reauthentication** | `reauthentication.html` | `Il tuo codice di verifica Mach.bank` |

## Variabili Go template usate

Supabase espone queste variabili:

| Variabile | Quando è disponibile |
|---|---|
| `{{ .ConfirmationURL }}` | quasi tutti i template (link con token incluso) |
| `{{ .Token }}` | reauthentication (6 cifre OTP) |
| `{{ .TokenHash }}` | tutti (hash del token) |
| `{{ .Email }}` | tutti (email destinatario) |
| `{{ .NewEmail }}` | change-email (nuovo indirizzo) |
| `{{ .RedirectTo }}` | tutti (URL di redirect dopo conferma) |
| `{{ .SiteURL }}` | tutti (Site URL configurato in Auth Settings) |

## Procedura step-by-step

1. **Configura SMTP custom** prima di toccare i template
   (Settings → Auth → SMTP Settings)
2. Vai su **Authentication → Email Templates**
3. Per ogni template:
   1. Click sulla tab corrispondente in alto (Confirm signup, Invite user, …)
   2. Modifica il **Subject** con quello suggerito sopra
   3. Cancella il body default
   4. Copia tutto il contenuto del file `.html` corrispondente
   5. Incolla nel campo **Message Body**
   6. Click **Save**
4. **Test**:
   - Confirm signup → registra una mail su `riconciliazione-bancaria.vercel.app/login.html`
   - Reset password → click "Password dimenticata?" sul login
   - Magic link → solo se hai abilitato il magic link login

## Personalizzazioni rapide

Se vuoi cambiare colori brand, cerca questi codici esadecimali nei file:

- `#1c1c1c` → ink (testo primario, bottone, mark)
- `#3c3c3a` → testo body
- `#8b8a85` → muted (testi secondari, italics nei titoli)
- `#ececea` → linea separatori
- `#faf9f4` → sfondo paper / blocchi info

## Note

- I template **non** caricano Google Fonts via `<link>` perché molti client mail
  (Gmail in primis) li strippano. Si fa fallback a Georgia che è preinstallato
  ovunque e ha lo stesso flavour serif elegante di Instrument Serif.
- Il CTA primario usa una `<table>` annidata per essere cliccabile in tutti i
  client mail, anche Outlook/Office 365.
- Il preheader nascosto (la prima `<div style="display:none;…">`) controlla
  l'anteprima inbox: tienilo coerente col contenuto.
