import { useState } from "react";
import "./App.css";
const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const submitOptions = [
    "Act as an Actor",
    "Act as an comedian",
    "Act as an cricketer",
    "Act as an chef",
    "Act as my wife",
    "Act as my daughter",
    "Act as a Scientist",
  ];

  const submit = () => {
    const randomValue =
      submitOptions[Math.floor(Math.random() * submitOptions.length)];
    setValue(randomValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Invalid! Ask a Question");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8080/gemini", options); // Update URL if needed
      const data = await response.text();
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [{ text: value }],
        },
        {
          role: "model",
          parts: [{ text: data }],
        },
      ]);
      console.log("Chat History: ", chatHistory);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong! Please try again later.");
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  return (
    <div className="chat">
      <p className="head">
        Roleplay Model name it
        <button className="submit" onClick={submit} disabled={!chatHistory}>
          Show
        </button>
      </p>
      <div className="input-container">
        <input
          value={value}
          placeholder="How do want me to act as ..?"
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse}>Send</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}

      <div className="search-result">
        {chatHistory.map((chatItem, _index) => (
          <div key={_index}>
            <p className="answer">
              {chatItem.role}: {chatItem.parts.map((part) => part.text)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;