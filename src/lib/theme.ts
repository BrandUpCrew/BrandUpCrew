export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "future-theme";
const THEME_CHANGE_EVENT = "future-theme-change";
function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getSavedTheme(): Theme | null {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
  } catch (error) {
    console.error("Unable to read the saved color theme.", error);
    return null;
  }
}

export function getTheme(): Theme {
  const theme = document.documentElement.dataset.theme;
  return theme === "dark" || theme === "light" ? theme : getSystemTheme();
}

export function getServerTheme(): Theme {
  return "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.themeSwitching = "true";
  root.dataset.theme = theme;
  window.requestAnimationFrame(() => {
    delete root.dataset.themeSwitching;
  });
  const themeColor = theme === "dark" ? "#04060f" : "#ffffff";
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => {
      meta.content = themeColor;
    });
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function setTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error("Unable to save the selected color theme.", error);
  }
  applyTheme(theme);
}

export function subscribeToThemeChanges(onChange: () => void = () => {}) {
  const onThemeChange = () => onChange();
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemThemeChange = () => {
    if (!getSavedTheme()) applyTheme(getSystemTheme());
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    applyTheme(getSavedTheme() ?? getSystemTheme());
  };

  media.addEventListener("change", onSystemThemeChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);

  return () => {
    media.removeEventListener("change", onSystemThemeChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
  };
}

export const initializeThemeScript = `
  (() => {
    const key = ${JSON.stringify(THEME_STORAGE_KEY)};
    let saved = null;
    try {
      saved = window.localStorage.getItem(key);
    } catch (error) {
      console.error("Unable to read the saved color theme.", error);
    }
    const theme =
      saved === "light" || saved === "dark"
        ? saved
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    const root = document.documentElement;
    root.dataset.themeSwitching = "true";
    root.dataset.theme = theme;
    window.requestAnimationFrame(() => {
      delete root.dataset.themeSwitching;
    });
    const themeColor = theme === "dark" ? "#04060f" : "#ffffff";
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute("content", themeColor));
  })();
`;
