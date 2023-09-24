import styles from "./PixelArt.module.css";
import { useState } from "react";
import eyeDropper from "./eye-dropper.svg";
import { RGBToHex } from "./Helpers";

function App() {
  const [color, setColor] = useState("#000000");
  const [colorRight, setColorRight] = useState("#000000");
  const [board, setBoard] = useState(
    new Array(32).fill(new Array(30).fill("#F4F4F4"))
  );
  const [isHolding, setIsHolding] = useState(false);
  const [previousColors, setPreviousColors] = useState([]);
  const [isColorPickerMode, setIsColorPickerMode] = useState(false);
  
    // TO DO: Criar um jeito visual de identificar cores selecionadas para o esquerdo e direito; Implementar pintar com o esquerdo e direito; 

  const debounce = (func, delay) => {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debounceOnChange = debounce((newColor) => {
    setColor(newColor);
  }, 200); // Atraso de 300ms

  const setCellColor = (i, j) => {
    let newBoard = JSON.parse(JSON.stringify(board));
    newBoard[i][j] = color;
    setBoard(newBoard);
    addColorToHistory(color);
  };

  const handleMouseEnter = (i, j) => {
    if (!isHolding) return;

    setCellColor(i, j);
  };

  const addColorToHistory = (color) => {
    if (previousColors.includes(color)) return;
    const newHistory = [...previousColors];
    newHistory.push(color);
    setPreviousColors(newHistory);
  };

  return (
    <div className={styles.container}>
      <div className={styles.colors}>
        <div className={styles.colorPicker}>
          <input
            type="color"
            value={color}
            onChange={(e) => debounceOnChange(e.target.value)}
          />
          <button className={isColorPickerMode ? styles.active : ""} onClick={() => setIsColorPickerMode(!isColorPickerMode)}>
            <img src={eyeDropper} alt="" />
          </button>
        </div>
        <div className={styles.history}>
          {previousColors.map((color, index) => (
            <div
              key={index}
              className={styles.previousColor}
              style={{ backgroundColor: color }}
              onClick={(event) =>
                setColor(RGBToHex(event.currentTarget.style.backgroundColor))
              }
            ></div>
          ))}
        </div>
      </div>

      <div className={styles.board}>
        {board.map((line, i) => (
          <div key={i} className={styles.line}>
            {line.map((cell, j) => (
              <div
                key={j}
                className={styles.cell}
                style={{ backgroundColor: cell }}
                onMouseEnter={() => handleMouseEnter(i, j)}
                onMouseDown={(event) => {
                  if (isColorPickerMode) {
                    setColor(RGBToHex(event.currentTarget.style.backgroundColor))
                    setIsColorPickerMode(false)
                  } else {
                    setIsHolding(true);
                    setCellColor(i, j);
                  }
                }}
                onMouseUp={() => setIsHolding(false)}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
