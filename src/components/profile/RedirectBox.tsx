import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeProvider";

export default function RedirectBox({
  message,
  redirectLink,
  buttonText,
}: {
  message: string;
  redirectLink: string;
  buttonText: string;
}) {
  const { styles: redirectBoxStyle } = useTheme();
  const styles = redirectBoxStyle.redirectBox;
  return (
    <>
      <div className="d-flex flex-column align-items-center mb-3 py-3">
        <h1 className={`${styles.message} text-center`}>{message}</h1>
        <Link to={`${redirectLink}`}>
          <button className={`btn btn-success ${styles.redirectButton}`}>
            {buttonText}
          </button>
        </Link>
      </div>
    </>
  );
}
