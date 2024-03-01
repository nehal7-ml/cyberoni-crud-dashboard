"use client";
import { Check, Copy, RefreshCw } from "lucide-react";
import React, {
  HTMLAttributes,
  useState,
  MouseEventHandler,
  useEffect,
} from "react";

const PasswordGenerator = (props: {
  onChange: any;
  name: string;
  value: string;
  className: string;
  required?: boolean;
}) => {
  const [password, setPassword] = useState("");
  const [showCheck, setShowCheck] = useState(false);

  const generatePassword: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    // You can use a password generation library or your own logic here
    // For simplicity, we'll generate a random string of 12 characters
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@&!";
    let newPassword = "";
    for (let i = 0; i < 10; i++) {
      newPassword += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    setPassword(newPassword);
    props.onChange({ target: { name: props.name, value: newPassword } });
  };

  const copyToClipboard: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(password);
    setShowCheck(true);
  };

  useEffect(() => {
    if (showCheck)
      setTimeout(() => {
        setShowCheck(false);
      }, 300);
  }, [setShowCheck, showCheck]);

  useEffect(() => {
    if (props.value) setPassword(props.value);
  }, [props.value]);
  const runOnChange = () => {
    props.onChange({ name: props.name, value: password });
  };
  return (
    <>
      <div className="my-4 flex space-x-3">
        <input type="password" {...props} />
        <button
          onClick={copyToClipboard}
          className=" rounded-lg px-4 py-2 shadow-md  hover:shadow-lg"
        >
          {showCheck ? <Check className="text-green-400 " /> : <Copy />}
        </button>
        <button
          onClick={generatePassword}
          className="rounded-lg px-4 py-2 shadow-md  hover:shadow-lg"
        >
          <RefreshCw />
        </button>
      </div>
    </>
  );
};

export default PasswordGenerator;
