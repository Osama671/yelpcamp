import lightCampgroundsStyle from "./lightTheme/campgrounds.module.css";
import lightNewCampgroundStyle from "./lightTheme/newCampground.module.css";
import lightCampgroundDetailsStyle from "./lightTheme/campgroundDetails.module.css";
import lightEditCampgroundStyle from "./lightTheme/editcampground.module.css";
import lightNavbarStyle from "./lightTheme/navbar.module.css"
import lightFooterStyle from "./lightTheme/footer.module.css"

import darkCampgroundsStyle from "./darkTheme/campgrounds.module.css";
import darkNewCampgroundStyle from "./darkTheme/newCampground.module.css";
import darkCampgroundDetailsStyle from "./darkTheme/campgroundDetails.module.css";
import darkEditCampgroundStyle from "./darkTheme/editcampground.module.css";
import darkNavbarStyle from "./darkTheme/navbar.module.css"
import darkFooterStyle from "./darkTheme/footer.module.css"

const themes = {
  light: {
    campgrounds: lightCampgroundsStyle,
    newCampground: lightNewCampgroundStyle,
    campgroundDetails: lightCampgroundDetailsStyle,
    editCampground: lightEditCampgroundStyle,
    navbar: lightNavbarStyle,
    footer: lightFooterStyle,
  },
  dark: {
    campgrounds: darkCampgroundsStyle,
    newCampground: darkNewCampgroundStyle,
    campgroundDetails: darkCampgroundDetailsStyle,
    editCampground: darkEditCampgroundStyle,
    navbar: darkNavbarStyle,
    footer: darkFooterStyle,
  },
};

export default themes;
