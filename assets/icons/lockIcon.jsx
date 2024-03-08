import * as React from "react";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";
const LockIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" fillOpacity={0} d="M0 0h18v18H0z" />
      </ClipPath>
    </Defs>
    <Path fill="none" d="M0 0h18v18H0z" />
    <G clipPath="url(#a)">
      <Path
        fill="#FFF"
        d="M15.375 6.75H14.25v-1.5A5.256 5.256 0 0 0 9 0a5.256 5.256 0 0 0-5.25 5.25v1.5H2.625a.375.375 0 0 0-.375.375V16.5c0 .827.673 1.5 1.5 1.5h10.5c.827 0 1.5-.673 1.5-1.5V7.125a.375.375 0 0 0-.375-.375ZM12 6.75H6v-1.5c0-1.654 1.346-3 3-3s3 1.346 3 3v1.5Z"
      />
    </G>
  </Svg>
);
export default LockIcon;
