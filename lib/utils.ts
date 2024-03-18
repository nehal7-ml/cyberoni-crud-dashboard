import slugify from "slugify"
export interface HttpError extends Error {
  status: number;
  message: string;
}

export function HttpError(status: number, message: string) {
  const error = Error(message) as HttpError;
  error.status = status;
  return error;
}

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }

  return res.json();
}

export function nFormatter(num: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

export function capitalize(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

export function bufferToB64(buffer: any, mimetype: string) {
  const b64 = Buffer.from(buffer).toString("base64");
  let dataURI = "data:" + mimetype + ";base64," + b64;
  return dataURI;
}

export function generateUUID() {
  // Create a random UUID using the crypto API if available
  if (
    typeof window.crypto !== "undefined" &&
    typeof window.crypto.getRandomValues === "function"
  ) {
    const buffer = new Uint16Array(8);
    window.crypto.getRandomValues(buffer);

    const uuid = [];
    uuid.push(buffer[0], buffer[1], buffer[2], buffer[3]);
    uuid.push((buffer[4] & 0x0fff) | 0x4000);
    uuid.push((buffer[5] & 0x3fff) | 0x8000);
    uuid.push(buffer[6], buffer[7]);

    return uuid.map((part) => part.toString(16).padStart(4, "0")).join("-");
  } else {
    // Fallback to a less secure method if crypto API is not available
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }
}

export function wrappedSlice(
  arr: Array<any>,
  startIndex: number,
  endIndex: number,
) {
  if (arr.length === 0) {
    return [];
  }

  // Handle negative indices
  if (startIndex < 0) {
    startIndex = arr.length + startIndex;
  }
  if (endIndex < 0) {
    endIndex = arr.length + endIndex;
  }

  // Wrap indices to stay within the array bounds
  startIndex = startIndex % arr.length;
  endIndex = endIndex % arr.length;

  // Handle wrapping where endIndex is smaller than startIndex
  if (endIndex < startIndex) {
    return arr.slice(startIndex).concat(arr.slice(0, endIndex + 1));
  } else {
    return arr.slice(startIndex, endIndex + 1);
  }
}

export function generatePassword() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@&!";
  let newPassword = "";
  for (let i = 0; i < 10; i++) {
    newPassword += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  return newPassword;
}

export function stripSlashes(str: string) {
  // Remove leading slashes
  str = str.replace(/^\/+/g, "");

  // Remove trailing slashes
  str = str.replace(/\/+$/g, "");

  return str;
}

export function objectToSearchParams(obj: any): string {
  const searchParams = new URLSearchParams();

  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      if (Array.isArray(obj[key])) {
        // If it's an array, add each element separately
        obj[key].forEach((element: string | number) =>
          searchParams.append(key, element.toString()),
        );
      } else {
        searchParams.set(key, obj[key].toString());
      }
    }
  }

  return searchParams.toString();
}

// Function to add f_auto parameter to the Cloudinary image URL
export function addAutoFormatParameter(url: string): string {
  // Check if the URL already contains "f_auto"
  if (url.includes("f_auto")) {
    return url; // Return URL unchanged if "f_auto" parameter is already present
  }

  // Insert "f_auto" parameter before "/v" in the URL
  const indexOfVersion = url.indexOf("/v");
  const urlWithAutoFormat = `${url.slice(0, indexOfVersion)}/f_auto${url.slice(indexOfVersion)}`;

  return urlWithAutoFormat;
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function seoUrl(title: string, id: string) {
  return encodeURIComponent(slugify(`${title} ${id}`, {
    replacement: '-'
  }))


}