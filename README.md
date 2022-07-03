# JS Theme Changer
A reusable site theme-changer that provides the blueprint for creating a theme changer. It __does not__ provide any "themes" just the tools to select between themes, load them on the page and store the selected theme choice.

> You may want to run this code through a "JavaScript Minifier" to remove comments (except a license comment of course)

## Features
- Change theme without reloading page
- Store user choice in session/local data (no cookies)
- Pure JavaScript (no external libraries needed)
- Uses HTML datasets
- No limit on theme choices
- Dynamically add and remove a theme-selection dialog
- Code is heavily documented

## Usage
This section will guide you on how to use the theme changer in your project.

### Setup Of Theme Changer
```js
// add this if you change the browser controlled theming key from 'os'
ThemeChanger.os_theme = "os";
// change what dataset is used
ThemeChanger.dataset_theme_name] = "theme"
// set your themes in this format (you can add more than shown here)
ThemeChanger.themes = {
    os: name: "OS",
    light: "Light",
    dark: "Dark"
};
// setup on page load
document.addEventListener("load", ThemeChanger.on_load);
```

### Use Theme Picker
```js
// this will allow the theme picker to appear and disappear on a button click
const my_button = document.getElementById("my-bnt");
my_button.addEventListener("click", ThemeChanger.toggle_theme_picker);
```

### Example CSS
```css
[data-theme=light]:root {
    background-color: white;
}
[data-theme=dark]:root {
    background-color: black;
}
```

## Minifier
I use [UglifyJS](https://www.npmjs.com/package/uglify-js), however you can use whatever one works for you.

```
npm install uglify-js -g

uglifyjs theme-changer.js --source-map -o theme-changer.min.js
```

## License
MIT License - Copyright (c) 2022 Leo Spratt

Full license can be found in the `LICENSE` file.
