import lightCampgroundsStyle from "./lightTheme/campgrounds.module.css";
import lightNewCampgroundStyle from "./lightTheme/newCampground.module.css";
import lightCampgroundDetailsStyle from "./lightTheme/campgroundDetails.module.css";
import lightEditCampgroundStyle from "./lightTheme/editcampground.module.css";

import darkCampgroundsStyle from "./darkTheme/campgrounds.module.css";
import darkNewCampgroundStyle from "./darkTheme/newCampground.module.css";
import darkCampgroundDetailsStyle from "./darkTheme/campgroundDetails.module.css";
import darkEditCampgroundStyle from "./darkTheme/editcampground.module.css";

const themes = {
  light: {
    campgrounds: lightCampgroundsStyle,
    newCampground: lightNewCampgroundStyle,
    campgroundDetails: lightCampgroundDetailsStyle,
    editCampground: lightEditCampgroundStyle,
  },
  dark: {
    campgrounds: darkCampgroundsStyle,
    newCampground: darkNewCampgroundStyle,
    campgroundDetails: darkCampgroundDetailsStyle,
    editCampground: darkEditCampgroundStyle,
  },
};

export default themes;
