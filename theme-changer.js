"use-strict";

/**
 * static class that handles
 * everything to do with css themes
 */
class ThemeChanger {
    /**
     * What the current theme will be
     * stored in the local/session data as
     */
    static saved_theme_key = "theme";
    /**
     * the id for the theme picker element
     * that allows the changing of themes
     */
    static theme_picker_id = "theme-picker-selector";
    /**
     * the theme keys
     */
    static theme_keys = {
        OS: "os",
        LIGHT: "light",
        DARK: "dark",
    };
    /**
     * Each theme { key: [ user title, theme-properties[ name, value ] ] }
     *
     * The OS theme is a special theme that
     * will get the theme from the browser
     * (if "prefers-color-scheme" has been used in css)
     */
    static theme_meta = {
        "os": ["OS", []],
        "light": ["Light", []],
        "dark": ["Dark", []],
    };
    /**
     * current theme that has been selected
     */
    static curr_theme = ThemeChanger.theme_keys.OS;
    /**
     * load the stored theme from local/session storage
     * (if one was ever stored)
     *
     * @returns the current theme
     */
    static get_stored_theme_choice() {
        var new_theme = window.localStorage.getItem(ThemeChanger.saved_theme_key);
        if (new_theme === null) {
            new_theme = window.sessionStorage.getItem(ThemeChanger.saved_theme_key);
        }
        if (new_theme === null) {
            new_theme = ThemeChanger.theme_keys.OS;
        }
        ThemeChanger.curr_theme = new_theme;
        return new_theme;
    }
    /**
     * load the current pages theme css properties
     */
    static load_theme_properties() {
        const theme_properties = ThemeChanger.theme_meta[ThemeChanger.curr_theme][1];
        theme_properties.forEach(key_value => {
            document.documentElement.style.setProperty(key_value[0], key_value[1]);
        });
    }
    /**
     *
     * @param {ThemeChanger.theme_keys} theme_key - the new theme to load
     * @param {boolean} use_local - whether to store in local storage
     * @param {boolean} allow_reload - whether to allow page reloading
     */
    static change_theme(theme_key, use_local = false, allow_reload = true) {
        if (use_local) {
            window.localStorage.setItem(ThemeChanger.saved_theme_key, theme_key);
            window.sessionStorage.removeItem(ThemeChanger.saved_theme_key);
        }
        else {
            window.sessionStorage.setItem(ThemeChanger.saved_theme_key, theme_key);
            window.localStorage.removeItem(ThemeChanger.saved_theme_key);
        }
        ThemeChanger.get_stored_theme_choice();
        if (theme_key === ThemeChanger.theme_keys.OS && allow_reload) {
            // required so that user will not have any themes
            window.location.reload();
            return;
        }
        ThemeChanger.load_theme_properties();
    }
    /**
     * you can use this method when
     * loading the theme during page load
     */
    static on_load() {
        ThemeChanger.get_stored_theme_choice();
        ThemeChanger.load_theme_properties();
    }
}
