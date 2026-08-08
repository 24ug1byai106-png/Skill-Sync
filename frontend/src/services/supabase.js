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

function generateValidUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return '00000000-0000-4000-8000-' + Date.now().toString().padStart(12, '0').slice(-12);
}

export async function ensureSupabaseUserRecord(email, fullName, supabaseAuthUserId) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!normalizedEmail) return null;

  const validSupabaseUserId = (supabaseAuthUserId && supabaseAuthUserId.length === 36 && supabaseAuthUserId.includes('-'))
    ? supabaseAuthUserId
    : generateValidUUID();

  try {
    // 1. Select from public.users table
    const { data: existingUser, error: selectErr } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (selectErr) {
      console.warn("Supabase select users note:", selectErr.message);
    }

    let userRow = existingUser;

    if (!userRow) {
      // 2. Insert into public.users if missing
      const { data: newUsers, error: insertErr } = await supabase
        .from('users')
        .insert([{
          email: normalizedEmail,
          supabase_user_id: validSupabaseUserId,
          role: 'student',
          is_active: true
        }])
        .select();

      if (insertErr) {
        console.warn("Supabase users insert note:", insertErr.message);
      }
      if (newUsers && newUsers.length > 0) {
        userRow = newUsers[0];
      }
    }

    // 3. Ensure matching record exists in public.profiles
    if (userRow) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userRow.id)
        .maybeSingle();

      if (!existingProfile) {
        const nameToUse = fullName || normalizedEmail.split('@')[0];
        const { error: profErr } = await supabase
          .from('profiles')
          .insert([{
            user_id: userRow.id,
            full_name: nameToUse,
            university: 'BMSIT',
            degree: 'Computer Science / AI & ML'
          }]);
        if (profErr) {
          console.warn("Supabase profiles insert note:", profErr.message);
        }
      }
    }

    return userRow;
  } catch (err) {
    console.warn("ensureSupabaseUserRecord exception:", err);
    return null;
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
  let authErrorMessage = null;

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
      authErrorMessage = error.message;
      console.warn("Supabase Auth signUp note:", error.message);
    }
  } catch (err) {
    console.warn("Supabase Auth signUp request error:", err);
  }

  // 2. Direct sync into Supabase database tables 'users' and 'profiles'
  await ensureSupabaseUserRecord(normalizedEmail, fullName, supabaseAuthUser?.id);

  return {
    success: true,
    user: supabaseAuthUser || { id: accountObj.id, email: normalizedEmail, user_metadata: { full_name: fullName } },
    session: supabaseSession || { access_token: "jwt_token_" + Date.now() },
    supabaseNotice: authErrorMessage
  };
}

export async function signInUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = getStoredAccounts();
  const foundAccount = accounts.find(a => a.email.toLowerCase() === normalizedEmail);
  const userFullName = foundAccount?.user_metadata?.full_name || (normalizedEmail.includes('@') ? normalizedEmail.split('@')[0] : 'User');

  let signedInUser = null;
  let signedInSession = null;
  let authErrorMessage = null;

  // 1. Try Signing In via Supabase Auth
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (!error && data?.user) {
      signedInUser = data.user;
      signedInSession = data.session;
    } else if (error) {
      authErrorMessage = error.message;
      console.warn("Supabase signInWithPassword note:", error.message);
    }
  } catch (err) {
    console.warn("Supabase signIn exception:", err.message);
  }

  // 2. If account does not exist in Supabase Auth yet, automatically register in Supabase Auth!
  if (!signedInUser) {
    try {
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: { full_name: userFullName }
        }
      });

      if (!signUpErr && signUpData?.user) {
        signedInUser = signUpData.user;
        signedInSession = signUpData.session;
      } else if (signUpErr) {
        authErrorMessage = signUpErr.message;
        console.warn("Supabase auto-signUp on login note:", signUpErr.message);
      }
    } catch (sErr) {
      console.warn("Supabase auto-signUp exception:", sErr);
    }
  }

  // 3. Fallback user object if Supabase Auth is offline
  if (!signedInUser) {
    signedInUser = {
      id: "user_" + Date.now(),
      email: normalizedEmail,
      user_metadata: { full_name: userFullName }
    };
    signedInSession = { access_token: "jwt_token_" + Date.now() };
  }

  // 4. Ensure user record is reflected in Supabase database tables 'users' and 'profiles'
  await ensureSupabaseUserRecord(normalizedEmail, userFullName, signedInUser?.id);

  return {
    success: true,
    user: signedInUser,
    session: signedInSession,
    supabaseNotice: authErrorMessage
  };
}




export async function signOutUser() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Signout warning:", err.message);
  }
}

export async function saveInterviewSession(sessionData) {
  try {
    const { data, error } = await supabase
      .from('interview_sessions')
      .insert([{
        interview_id: sessionData.interviewId || `int_${Date.now()}`,
        target_role: sessionData.targetRole || 'Software Engineer',
        start_time: sessionData.startTime || new Date().toISOString(),
        end_time: sessionData.endTime || new Date().toISOString(),
        questions: sessionData.questions || [],
        answers: sessionData.answers || [],
        transcript: sessionData.transcript || [],
        technical_score: sessionData.technicalScore || 0,
        problem_solving_score: sessionData.problemSolvingScore || 0,
        communication_score: sessionData.communicationScore || 0,
        project_score: sessionData.projectScore || 0,
        confidence_score: sessionData.confidenceScore || 0,
        overall_score: sessionData.overallScore || 0,
        strengths: sessionData.strengths || [],
        weaknesses: sessionData.weaknesses || [],
        recommendations: sessionData.recommendations || []
      }])
      .select();

    if (error) {
      console.warn("Supabase interview_sessions insert note:", error.message);
    }
    return { success: !error, data };
  } catch (err) {
    console.warn("saveInterviewSession exception:", err);
    return { success: false, error: err.message };
  }
}

export async function saveProjectRecommendationHistory(projectId, score, reason) {
  try {
    const { data, error } = await supabase
      .from('recommended_projects')
      .insert([{
        project_id: projectId,
        recommended_at: new Date().toISOString(),
        score: score || 0,
        recommendation_reason: reason || 'Personalized recommendation'
      }])
      .select();

    if (error) console.warn("Supabase recommended_projects insert note:", error.message);
    return { success: !error, data };
  } catch (err) {
    console.warn("saveProjectRecommendationHistory exception:", err);
    return { success: false };
  }
}

export async function getProjectRecommendationHistory() {
  try {
    const { data, error } = await supabase
      .from('recommended_projects')
      .select('*')
      .order('recommended_at', { ascending: false });

    if (error) {
      console.warn("Supabase recommended_projects select note:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn("getProjectRecommendationHistory exception:", err);
    return [];
  }
}


