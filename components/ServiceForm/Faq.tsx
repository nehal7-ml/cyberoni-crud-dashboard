import { CreateFaqDTO } from "@/crud/DTOs";
import { FAQ } from "@prisma/client";
import React, { useEffect, useState } from "react";

const FAQForm = ({
  initial = [],
  onChange,
}: {
  initial?: CreateFaqDTO[];
  onChange: (faqs: CreateFaqDTO[]) => void;
}) => {
  const [faqs, setFaqs] = useState<CreateFaqDTO[]>(initial);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAddFAQ = () => {
    // Validate input (you can add more sophisticated validation if needed)
    // Create a new FAQ object
    const newFAQ = {
      question: question.trim(),
      answer: answer.trim(),
    };

    if (newFAQ.question && newFAQ.answer) {
      setFaqs((prev) => [...prev, newFAQ]);
      onChange(faqs);
    }
    // Call the callback function to handle the addition of the FAQ

    // Clear the input fields after adding the FAQ
    setQuestion("");
    setAnswer("");
  };

  useEffect(() => {
    if (initial && initial.length > 0) {
      setFaqs(initial);
    }
  }, [initial]);
  return (
    <div>
      <h2>Add FAQ</h2>
      <label>
        Question:
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Answer:
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
      </label>
      <br />
      <button onClick={handleAddFAQ}>Add FAQ</button>
    </div>
  );
};

export default FAQForm;
