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
     * the themes that can be selected
     */
    static themes = {
        os: {
            name: "OS",
            css: null,
        },
        light: {
            name: "Light",
            css: [],
        },
        dark: {
            name: "Dark",
            css: [],
        },
    };
    /**
     * the os controlled theme
     */
    static os_theme = "os";
    /**
     * current theme key that has been selected
     */
    static curr_theme;
    /**
     * get the selectable theme keys
     * @returns the theme key as a array
     */
    static use_local = false;
    static allow_reload = true;
    static get_theme_keys() {
        return Object.keys(ThemeChanger.themes);
    }
    /**
     * get an item from localStorage, sessionStorage,
     * falling back on default if none are found
     * @param {string} key - the key to get
     * @param {object} default_value - the default value
     * @returns
     */
    static get_item_from_storage(key, default_value) {
        return window.localStorage.getItem(key) || window.sessionStorage.getItem(key) || default_value;
    }
    /**
     * set an item from localStorage or sessionStorage
     * @param {string} key - the key to set
     * @param {object} value - the value to set
     */
    static set_item_to_storage(key, value) {
        if (ThemeChanger.use_local) {
            window.localStorage.setItem(key, value);
            window.sessionStorage.removeItem(key);
        }
        else {
            window.sessionStorage.setItem(key, value);
            window.localStorage.removeItem(key);
        }
    }
    /**
     * load the current pages theme css properties
     */
    static set_current_theme_css() {
        const theme_properties = ThemeChanger.themes[ThemeChanger.curr_theme].css;
        theme_properties?.forEach(key_value => {
            document.documentElement.style.setProperty(...key_value);
        });
    }
    /**
     * Change the current page theme
     * @param {string} theme_key - the new theme to load
     */
    static change_current_theme(theme_key) {
        ThemeChanger.set_item_to_storage(ThemeChanger.saved_theme_key, theme_key);
        ThemeChanger.curr_theme = theme_key;
        if (theme_key === ThemeChanger.os_theme && ThemeChanger.allow_reload) {
            // required so that user will not have any themes
            window.location.reload();
            return;
        }
        ThemeChanger.set_current_theme_css();
    }
    /**
     * call this method on load to
     * get current theme and apply it
     */
    static on_load() {
        ThemeChanger.curr_theme = ThemeChanger.get_item_from_storage(ThemeChanger.saved_theme_key, ThemeChanger.os_theme);
        ThemeChanger.set_current_theme_css();
    }
    /**
     * Create a theme picker button ready for appending
     * @param {string} theme_key - the theme key
     * @returns {Element} the created button element
     */
    static create_theme_picker_button(theme_key) {
        const bnt_text = ThemeChanger.themes[theme_key].name;
        const element = document.createElement('button');
        element.addEventListener('click', _event => {
            ThemeChanger.remove_theme_picker();
            ThemeChanger.change_current_theme(theme_key);
        });
        element.innerText = bnt_text;
        if (ThemeChanger.curr_theme === theme_key) {
            element.classList.add(ThemeChanger.selected_theme_css_class);
        }
        return element;
    }
    /**
     * insert a new theme picker
     */
    static insert_theme_picker() {
        const picker_element = document.createElement("div");
        picker_element.setAttribute("id", ThemeChanger.theme_picker_id);
        for (let key of ThemeChanger.get_theme_keys()) {
            picker_element.appendChild(ThemeChanger.create_theme_picker_button(key));
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
     */
    static toggle_theme_picker() {
        const picker_element = document.getElementById(ThemeChanger.theme_picker_id);
        if (picker_element === null) {
            ThemeChanger.insert_theme_picker();
        }
        else {
            ThemeChanger.remove_theme_picker();
        }
    }
}
