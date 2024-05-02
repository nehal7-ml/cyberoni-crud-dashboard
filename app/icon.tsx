import { MAIN_LOGO } from "@/components/assets";
import { getBaseUrl } from "@/lib/utils";
import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
          }}
          height={size.height}
          width={size.width}
          alt="favicon"
          src={`${MAIN_LOGO}`}
        ></img>
        <div
          style={{
            display: "flex",
            position: "absolute",
            width: "100%",
            height: "22px",
            left: "0px",
            bottom: "0px",
            color: "black",
            alignItems: 'flex-start',
            alignContent: 'flex-start',
            justifyContent: 'flex-end'
          }}
        >
          {`🔒`}
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
      debug: false,
      emoji: 'openmoji'
    },
  );
}
