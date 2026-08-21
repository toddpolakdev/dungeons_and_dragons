import TestPage from "./pages/TestPage";

/**
 * Application shell.
 *
 * The only thing currently mounted is the development / testing UI. The final
 * player-facing presentation layer has not been designed yet — see
 * docs/01_PRODUCT_DIRECTION.md — so this stays deliberately thin, and swapping in
 * a real page (or adding routing) means changing what renders here rather than
 * unpicking the test harness.
 */
function App() {
  return <TestPage />;
}

export default App;
