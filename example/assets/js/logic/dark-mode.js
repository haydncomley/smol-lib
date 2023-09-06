const DARK_MODE_KEY = 'enable-dark-mode';

const SystemDarkMode = () => {
    if (window.matchMedia) return window.matchMedia('(prefers-color-scheme: dark)').matches;
    return false;
}

export const PrefersDarkMode = () => {
    const hasPreference = localStorage.getItem(DARK_MODE_KEY);
    if (hasPreference) return localStorage.getItem(DARK_MODE_KEY) === 'true';
    return SystemDarkMode();
}

export const SetPrefersDarkMode = (enableDarkMode) => {
    const systemPref = SystemDarkMode();
    if (enableDarkMode !== systemPref) localStorage.setItem(DARK_MODE_KEY, String(enableDarkMode));
    else localStorage.removeItem(DARK_MODE_KEY);
}