import AuthContextProvider from "./contexts/authContext";
import WorkPlaceContextProvider from "./contexts/workPlaceContext";
import AppNavigation from "./navigation/appNavigation";

export default function App() {
  return (
    <AuthContextProvider>
      <WorkPlaceContextProvider>
        <AppNavigation />
      </WorkPlaceContextProvider>
    </AuthContextProvider>
  );
}
