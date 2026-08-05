// Daily Login & LeetCode-style Monthly Streak Manager

export function recordDailyLogin() {
  return getStreakData();
}

export function getStreakData() {
  const defaultData = {
    currentStreak: 1,
    bestStreak: 1,
    lastLoginDate: new Date().toISOString().split('T')[0],
    monthlyHistory: generateInitialMonthlyHistory()
  };

  try {
    const stored = localStorage.getItem('skillsync_streak_data');
    if (!stored) {
      localStorage.setItem('skillsync_streak_data', JSON.stringify(defaultData));
      return defaultData;
    }

    const data = JSON.parse(stored);
    const todayStr = new Date().toISOString().split('T')[0];

    if (data.lastLoginDate === todayStr) {
      // Already logged in today
      return data;
    }

    const lastLogin = new Date(data.lastLoginDate);
    const today = new Date(todayStr);
    const diffTime = Math.abs(today - lastLogin);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day login!
      data.currentStreak += 1;
      data.bestStreak = Math.max(data.bestStreak, data.currentStreak);
    } else if (diffDays > 1) {
      // Streak missed, reset
      data.currentStreak = 1;
    }

    data.lastLoginDate = todayStr;
    
    // Mark today active in current month history
    const todayDayNum = new Date().getDate();
    if (data.monthlyHistory && data.monthlyHistory[todayDayNum - 1] !== undefined) {
      data.monthlyHistory[todayDayNum - 1] = true;
    }

    localStorage.setItem('skillsync_streak_data', JSON.stringify(data));
    return data;
  } catch (e) {
    return defaultData;
  }
}

function generateInitialMonthlyHistory() {
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const history = new Array(daysInMonth).fill(false);

  // Fill some realistic activity for earlier days of the month for demo
  for (let i = 0; i < currentDay; i++) {
    // 80% chance of login on past days of current month
    history[i] = (i % 5 !== 1);
  }
  history[currentDay - 1] = true; // Today is active
  return history;
}
