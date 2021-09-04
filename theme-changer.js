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
     * the parent element to insert theme picker
     */
    static theme_picker_parent = null;
    /**
     * Used to show the current theme that is selected
     */
    static selected_theme_css_class = "current";
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
        ThemeChanger.remove_theme_picker();
    }
    /**
     * you can use this method when
     * loading the theme during page load
     */
    static on_load() {
        ThemeChanger.get_stored_theme_choice();
        ThemeChanger.load_theme_properties();
    }
    /**
     *
     * @param {ThemeChanger.theme_keys} theme_key - the theme key
     * @param {boolean} use_local - whether to store in local storage
     * @param {boolean} allow_reload - whether to allow page reloading
     * @returns {Element} the created button element
     */
    static create_theme_picker_button(theme_key, use_local, allow_reload) {
        const bnt_text = ThemeChanger.theme_meta[theme_key][0];
        const element = document.createElement('button');
        element.addEventListener('click', _event => {
            ThemeChanger.change_theme(theme_key, use_local, allow_reload);
        });
        element.innerText = bnt_text;
        if (ThemeChanger.curr_theme === theme_key) {
            element.classList.add(ThemeChanger.selected_theme_css_class);
        }
        return element;
    }
    /**
     * insert a new theme picker
     * @param {boolean} use_local - whether to store in local storage
     * @param {boolean} allow_reload - whether to allow page reloading
     */
    static insert_theme_picker(use_local, allow_reload) {
        const picker_element = document.createElement("div");
        picker_element.setAttribute("id", ThemeChanger.theme_picker_id);
        for (let key in ThemeChanger.theme_keys) {
            picker_element.appendChild(
                ThemeChanger.create_theme_picker_button(
                    ThemeChanger.theme_keys[key], use_local, allow_reload)
            );
        }
        if (ThemeChanger.theme_picker_parent === null) {
            ThemeChanger.theme_picker_parent = document.body;
        }
        ThemeChanger.theme_picker_parent.insertAdjacentElement("afterbegin", picker_element);
    }
    /**
     * remove a theme picker if there is one on screen
     */
    static remove_theme_picker() {
        const picker_element = document.getElementById(ThemeChanger.theme_picker_id);
        picker_element?.remove();
    }
    /**
     * create or remove the theme picker
     * @param {boolean} use_local - whether to store in local storage
     * @param {boolean} allow_reload - whether to allow page reloading
     */
    static toggle_theme_picker(use_local = false, allow_reload = true) {
        const picker_element = document.getElementById(ThemeChanger.theme_picker_id);
        if (picker_element === null) {
            ThemeChanger.insert_theme_picker(use_local, allow_reload);
        }
        else {
            ThemeChanger.remove_theme_picker();
        }
    }
}
