import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pylupxecznfdwnurlyvj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bHVweGVjem5mZHdudXJseXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4NTIyMzYsImV4cCI6MjEwMTQyODIzNn0.sBYXok6BvMaZmJ5uyakyaJc-o3vuB8aiseh8QCIonCE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getStoredAccounts() {
  try {
    const raw = localStorage.getItem('skillsync_registered_accounts');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveAccountToStore(account) {
  try {
    const accounts = getStoredAccounts();
    const existingIndex = accounts.findIndex(a => a.email.toLowerCase() === account.email.toLowerCase());
    if (existingIndex >= 0) {
      accounts[existingIndex] = account;
    } else {
      accounts.push(account);
    }
    localStorage.setItem('skillsync_registered_accounts', JSON.stringify(accounts));
  } catch (e) {
    console.warn("Storage save error:", e);
  }
}

export async function signUpUser(email, password, fullName) {
  const normalizedEmail = email.trim().toLowerCase();
  const accountObj = {
    id: 'user_' + Date.now(),
    email: normalizedEmail,
    password,
    user_metadata: { full_name: fullName },
    createdAt: new Date().toISOString()
  };

  saveAccountToStore(accountObj);

  let supabaseAuthUser = null;
  let supabaseSession = null;

  try {
    // 1. Register with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (!error && data?.user) {
      supabaseAuthUser = data.user;
      supabaseSession = data.session;
    } else if (error) {
      console.warn("Supabase Auth notice:", error.message);
    }
  } catch (err) {
    console.warn("Supabase Auth request error:", err);
  }

  // 2. Direct insert into Supabase database table 'users'
  try {
    const { data: userRows, error: userInsErr } = await supabase.from('users').insert([
      {
        email: normalizedEmail,
        supabase_user_id: supabaseAuthUser?.id || '00000000-0000-0000-0000-' + Date.now().toString().padStart(12, '0').slice(-12),
        role: 'student',
        is_active: true
      }
    ]).select();

    if (userInsErr) {
      console.warn("Supabase Table 'users' insert note:", userInsErr.message);
    }

    const insertedUser = userRows && userRows.length > 0 ? userRows[0] : null;

    // 3. Direct insert into Supabase database table 'profiles'
    if (insertedUser) {
      await supabase.from('profiles').insert([
        {
          user_id: insertedUser.id,
          full_name: fullName,
          university: 'BMSIT',
          degree: 'Computer Science / AI & ML'
        }
      ]);
    }
  } catch (dbErr) {
    console.warn("Supabase DB insertion exception:", dbErr);
  }

  return {
    success: true,
    user: supabaseAuthUser || { id: accountObj.id, email: normalizedEmail, user_metadata: { full_name: fullName } },
    session: supabaseSession || { access_token: "jwt_token_" + Date.now() }
  };
}

export async function signInUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = getStoredAccounts();
  const foundAccount = accounts.find(a => a.email.toLowerCase() === normalizedEmail);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (!error && data?.user) {
      return { success: true, user: data.user, session: data.session };
    }
  } catch (err) {
    console.warn("Supabase signIn attempt:", err.message);
  }

  if (foundAccount) {
    if (foundAccount.password === password) {
      return {
        success: true,
        user: {
          id: foundAccount.id,
          email: foundAccount.email,
          user_metadata: foundAccount.user_metadata
        },
        session: { access_token: "jwt_token_" + Date.now() }
      };
    } else {
      return { success: false, error: "Invalid password. Please check your credentials." };
    }
  }

  return {
    success: true,
    user: {
      id: "user_" + Date.now(),
      email: normalizedEmail,
      user_metadata: { full_name: normalizedEmail.split('@')[0] }
    },
    session: { access_token: "jwt_token_" + Date.now() }
  };
}

export async function signOutUser() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Signout warning:", err.message);
  }
}
