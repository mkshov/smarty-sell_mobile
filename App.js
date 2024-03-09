import AuthContextProvider from "./contexts/authContext";
import TransferContextProvider from "./contexts/transferContext";
import WorkPlaceContextProvider from "./contexts/workPlaceContext";
import AppNavigation from "./navigation/appNavigation";

import "react-native-reanimated";
// import "react-native-gesture-handler";

export default function App() {
  return (
    <AuthContextProvider>
      <WorkPlaceContextProvider>
        <TransferContextProvider>
          <AppNavigation />
        </TransferContextProvider>
      </WorkPlaceContextProvider>
    </AuthContextProvider>
  );
}
