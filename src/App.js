import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const buttonColors = ["red", "blue", "green", "yellow"];

  const [gamePattern, setGamePattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [level, setLevel] = useState(0);
  const [started, setStarted] = useState(false);
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("Press Any Key to Start");
  const [pressed, setPressed] = useState(""); // for animation
  const bodyRef = useRef(null);

  // Prompt name once
  useEffect(() => {
    const name = prompt("Enter your name:") || "Player";
    setUserName(name);
  }, []);

  // Start game on keypress
  useEffect(() => {
    const handleKeyPress = () => {
      if (!started) {
        setMessage(`${userName}, You are on Level 0`);
        nextSequence();
        setStarted(true);
      }
    };
    document.addEventListener("keypress", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, [started, userName]);

  // Flash whenever gamePattern changes
  useEffect(() => {
    if (gamePattern.length > 0) {
      const lastColor = gamePattern[gamePattern.length - 1];
      setTimeout(() => {
        animatePress(lastColor);
        playSound(lastColor);
      }, 500);
    }
  }, [gamePattern]);

  // Play sound
  const playSound = (color) => {
    const audio = new Audio(process.env.PUBLIC_URL + `/sounds/${color}.mp3`);
    audio.play();
  };

  // Animate button
  const animatePress = (color) => {
    setPressed(color);
    setTimeout(() => setPressed(""), 200);
  };

  // Next sequence
  const nextSequence = () => {
    setUserPattern([]); // reset user input
    setLevel((prev) => prev + 1);
    setMessage(`${userName}, You are on Level ${level + 1}`);

    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColor = buttonColors[randomNumber];

    setGamePattern((prev) => [...prev, randomChosenColor]);
  };

  // Handle button click
  const handleClick = (color) => {
    const newPattern = [...userPattern, color];
    setUserPattern(newPattern);
    playSound(color);
    animatePress(color);

    checkAnswer(newPattern.length - 1, newPattern);
  };

  // Check user answer
  const checkAnswer = (currentLevel, newPattern) => {
    if (gamePattern[currentLevel] === newPattern[currentLevel]) {
      if (newPattern.length === gamePattern.length) {
        setTimeout(nextSequence, 1000);
      }
    } else {
      playSound("wrong");
      if (bodyRef.current) {
        bodyRef.current.classList.add("game-over");
        setTimeout(() => {
          bodyRef.current.classList.remove("game-over");
        }, 300);
      }
      setMessage("Game Over, Press Any Key / Reload to Restart!");
      startOver();
    }
  };

  // Reset game
  const startOver = () => {
    setLevel(0);
    setGamePattern([]);
    setStarted(false);
  };

  return (
    <div className="App" ref={bodyRef}>
      <h1 id="level-title">{message}</h1>
      <div className="container">
        <div className="row">
          <div
            type="button"
            id="green"
            className={`btn green ${pressed === "green" ? "pressed" : ""}`}
            onClick={() => handleClick("green")}
          ></div>
          <div
            type="button"
            id="red"
            className={`btn red ${pressed === "red" ? "pressed" : ""}`}
            onClick={() => handleClick("red")}
          ></div>
        </div>

        <div className="row">
          <div
            type="button"
            id="yellow"
            className={`btn yellow ${pressed === "yellow" ? "pressed" : ""}`}
            onClick={() => handleClick("yellow")}
          ></div>
          <div
            type="button"
            id="blue"
            className={`btn blue ${pressed === "blue" ? "pressed" : ""}`}
            onClick={() => handleClick("blue")}
          ></div>
        </div>
      </div>

      <div className="footer">
        💖 from <a href="https://azizshahdawala.github.io/AboutMe/"> Aziz </a>
      </div>
    </div>
  );
}

export default App;
