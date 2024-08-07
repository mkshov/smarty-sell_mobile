import FlashMessage from "react-native-flash-message";
import AuthContextProvider from "./contexts/authContext";
import SellContextProvider from "./contexts/sellContext";
import TransferContextProvider from "./contexts/transferContext";
import WorkPlaceContextProvider from "./contexts/workPlaceContext";
import AppNavigation from "./navigation/appNavigation";

import icon from "./assets/splash-image.jpg";
console.log("icon: ", icon);

import "react-native-reanimated";

export default function App() {
  return (
    <AuthContextProvider>
      <WorkPlaceContextProvider>
        <SellContextProvider>
          <TransferContextProvider>
            <AppNavigation />
            <FlashMessage />
          </TransferContextProvider>
        </SellContextProvider>
      </WorkPlaceContextProvider>
    </AuthContextProvider>
  );
}
