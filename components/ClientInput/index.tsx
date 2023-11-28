'use client'
import { DetailedHTMLProps, InputHTMLAttributes, useEffect, useState } from "react";



function ClientInput(props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
    const [isClient, setIsClient] = useState(false);
    const [input, setInput] = useState('');

    useEffect(() => {
        setIsClient(true)
    }, [])
    return (<>{isClient? <input key='client' {...props} /> : <input key='server' value={input} onChange={()=>{}}  className={props.className} />}</>);
}

export default ClientInput