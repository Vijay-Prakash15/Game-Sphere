import { useEffect } from "react";
import useUserStore from "./store/userStore";
import AppRoutes from "./routes";

function App() {
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser(); // refresh user on reload
  }, []);

  return <AppRoutes />;
}

export default App;