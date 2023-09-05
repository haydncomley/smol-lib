const DARK_MODE_KEY = 'enable-dark-mode';

export const PrefersDarkMode = () => {
    const hasPreference = localStorage.getItem(DARK_MODE_KEY);
    if (hasPreference) return localStorage.getItem(DARK_MODE_KEY) === 'true';
    if (window.matchMedia) {
        const systemSetting = window.matchMedia('prefers-color-scheme: dark').matches;
        SetPrefersDarkMode(systemSetting)
        return systemSetting;
    };
    return false;
}

export const SetPrefersDarkMode = (enableDarkMode) => {
    if (enableDarkMode) localStorage.setItem(DARK_MODE_KEY, 'true');
    else localStorage.removeItem(DARK_MODE_KEY);
}