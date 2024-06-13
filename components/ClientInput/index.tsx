"use client";
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useState,
} from "react";

interface ClientInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  id: string;
}

function ClientInput(props: ClientInputProps) {
  const { id, ...rest } = props;
  const [isClient, setIsClient] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient ? (
        <input key="client" id={id} {...rest} />
      ) : (
        <input
          key="server"
          id={id}
          value={input}
          onChange={() => {}}
          className={rest.className}
        />
      )}
    </>
  );
}

export default ClientInput;
