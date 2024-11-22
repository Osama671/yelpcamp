import { useTheme } from "./contexts/ThemeProvider";

export default function Loader({ loadingMessage }: { loadingMessage: string }) {
  const { styles: loaderStyles } = useTheme();
  const styles = loaderStyles.loader;
  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <h2 className={`${styles.loader}`}>{loadingMessage}</h2>
      </div>
    </>
  );
}
