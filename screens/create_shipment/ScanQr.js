import React from "react";
import Scanner from "../../components/scanner/Scanner";

export default function ScanQrForAddProduct({ navigation }) {
  return <Scanner actionType="transfer" cartPath="cart-for-scan" />;
}
