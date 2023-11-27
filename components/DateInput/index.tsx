'use client'

import { DetailedHTMLProps, InputHTMLAttributes, useEffect, useState } from "react";

function DateInput(props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
    const [date, setDate] = useState<Date>(new Date());
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');

    useEffect(() => {
        // Format the Date object into 'YYYY-MM-DD' format
        setYear((date.getFullYear()).toString());
        setMonth((date.getMonth() + 1).toString().padStart(2, '0'));  // Month is 0-indexed
        setDay(date.getDate().toString().padStart(2, '0'));

    }, [date]);

    return (<>
        <input
            {...props}
            value={``}
        />

    </>);
}

export default DateInput;