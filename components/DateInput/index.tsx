import React, { useState, ChangeEvent } from 'react';

interface DateInputProps {
    onDateChange: (event: { target: { value: Date, name: string } }) => void;
    name: string;
    id?: string;
    value?: Date
}

const DateInput: React.FC<DateInputProps> = ({ onDateChange, name, id , value}) => {
    const [selectedDate, setSelectedDate] = useState<string>(value?.toISOString().slice(0, 10) ?? "");

    const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newDate = event.target.value;
        setSelectedDate(newDate);
        onDateChange({
            target: {
                name: name,
                value: new Date(newDate)
            }
        });
    };

    return (
        <div>
            <input
                type="date"
                id={id}
                name={name}
                value={selectedDate}
                onChange={handleDateChange}
                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
        </div>
    );
};

export default DateInput;