import { useTheme } from "./contexts/ThemeProvider";

export default function Footer({
  stylesProp,
}: {
  stylesProp?: CSSModuleClasses;
}) {
  const { styles: campgroundStyles } = useTheme();
  const footerStyle = campgroundStyles.footer;

  const styles = stylesProp || footerStyle;
  return (
    <>
      <footer className={`${styles.footer} bg-dark py-3 mt-auto `}>
        <div className="container ">
          <span className="text-light">&copy; Yelpcamp</span>
        </div>
      </footer>
    </>
  );
}
