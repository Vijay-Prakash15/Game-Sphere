import { useEffect } from "react";
import useUserStore from "./store/userStore";
import AppRoutes from "./routes";
import GameRoom from "./pages/GameRoom";

function App() {
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser(); // refresh user on reload
  }, []);

  return <AppRoutes />;
}

export default App;