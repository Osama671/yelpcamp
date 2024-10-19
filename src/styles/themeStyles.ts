import lightCampgroundsStyle from "./lightTheme/campgrounds.module.css";
import lightNewCampgroundStyle from "./lightTheme/newCampground.module.css";

import darkCampgroundsStyle from "./darkTheme/campgrounds.module.css";
import darkNewCampgroundStyle from "./darkTheme/newCampground.module.css";

const themes = {
  light: {
    campgrounds: lightCampgroundsStyle,
    newCampground: lightNewCampgroundStyle,
  },
  dark: {
    campgrounds: darkCampgroundsStyle,
    newCampground: darkNewCampgroundStyle,
  },
};

export default themes
