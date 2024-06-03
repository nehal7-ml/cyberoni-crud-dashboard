import JsonInput from "@/components/shared/JsonInput";
import { render, fireEvent } from '@testing-library/react';

describe('JsonInput', () => {
    test('parseJson is called with correct value when button is clicked', () => {
        const parseJsonMock = jest.fn();
        const setRawJsonMock = jest.fn();
        const example = '{"key": "value"}';
        const { getByLabelText, getByText } = render(
            <JsonInput parseJson={parseJsonMock} setRawJson={setRawJsonMock} rawJson="" example={example} />
        );

        const textarea = getByLabelText('Json input auto fill:');
        fireEvent.change(textarea, { target: { value: '{"key": "value"}' } });

        const parseButton = getByText('Parse Json');
        fireEvent.click(parseButton);

        expect(parseJsonMock).toHaveBeenCalledWith('{"key": "value"}');
    });

    test('CopyButton is rendered with correct text', () => {
        const parseJsonMock = jest.fn();
        const setRawJsonMock = jest.fn();
        const example = '{"key": "value"}';
        const { getByText } = render(
            <JsonInput parseJson={parseJsonMock} setRawJson={setRawJsonMock} rawJson="" example={example} />
        );

        const copyButton = getByText('click to copy example');
        expect(copyButton).toBeInTheDocument();
    });
});
