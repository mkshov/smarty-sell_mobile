import React from "react";
import Scanner from "../../components/scanner/Scanner";

export default function ScanQrForAddProduct({ navigation }) {
  return <Scanner actionType="sell" cartPath="sell-cart" />;
}
