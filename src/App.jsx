import { useState, useEffect, useRef } from "react";

class Line {
   lineNumber = 0;
   nextLine = null;
   prevLine = null;
   sentence = "";

   constructor(word = "", lineNumber = 0) {
      this.sentence = word;
      this.lineNumber = lineNumber;
   }

   addCharacter(character) {
      this.sentence += character;
   }

   deleteCharacter() {
      if (this.sentence.length > 0) {
         this.sentence = this.sentence.slice(0, -1);
      }
   }

   addNewLine(newLine) {
      this.nextLine = newLine;
      newLine.prevLine = this;
   }

   addPrevLine(prevLine) {
      this.prevLine = prevLine;
      prevLine.nextLine = this;
   }
   moveCursorRight() {
      if (Line.currentCursor < Line.currentLine.sentence.length) {
         Line.currentCursor++;
      } else {
         Line.currentCursor = 0;
         Line.currentLineNumber++;
         Line.currentLine = Line.currentLine.nextLine;
      }
   }

   moveCursorLeft() {
      if (Line.currentCursor > 0) {
         Line.currentCursor--;
      } else {
         Line.currentLineNumber--;
         Line.currentCursor = Line.currentLine.prevLine.sentence.length;
      }
   }

   moveCursorUp() {
      if (Line.currentLine.prevLine) {
         Line.currentLine = Line.currentLine.prevLine;
         Line.currentLineNumber--;
         if (Line.currentCursor > Line.currentLine.sentence.length) {
            Line.currentCursor = Line.currentLine.sentence.length;
         }
      }
   }

   moveCursorDown() {
      if (Line.currentLine.nextLine) {
         Line.currentLine = Line.currentLine.nextLine;
         Line.currentLineNumber++;
         if (Line.currentCursor > Line.currentLine.sentence.length) {
            Line.currentCursor = Line.currentLine.sentence.length;
         }
      }
   }

   getCurrentLineNumber() {
      return this.currentLineNumber;
   }
}

function Cursor({ visible, left }) {
   return (
      <span
         className={`bg-black h-5 w-1 absolute top-0 left-${left} ${
            visible ? "visible" : "invisible"
         }`}
         style={{ left: `${left * 16}px` }}
      >
         I
      </span>
   );
}

function App() {
   const [cursor, setCursor] = useState(false);
   const [lines, setLines] = useState([new Line("")]);
   const [currentCursor, setCurrentCursor] = useState(0);
   const [currentLineNumber, setCurrentLineNumber] = useState(0);
   const [currentLine, setCurrentLine] = useState(lines[lines.length - 1]);
   const cursorRef = useRef(null);

   useEffect(() => {
      const handleKeyPress = (event) => {
         if (event.key !== "Enter" && event.key !== "Backspace") {
            // Add character to current line and update cursor position
            const updatedLine = currentLine;
            updatedLine.addCharacter(event.key);
            setCurrentLine(updatedLine);
            setCurrentCursor(currentCursor + 1);
         } else if (event.key === "Backspace") {
            // Delete character from current line and update cursor position
            if (currentCursor > 0) {
               const updatedLine = currentLine;
               updatedLine.deleteCharacter();
               setCurrentLine(updatedLine);
               setCurrentCursor(currentCursor - 1);
            }
         } else {
            // Add new line and update cursor and line number
            const newLine = new Line("", currentLineNumber + 1);
            setCurrentLineNumber(currentLineNumber + 1);
            setCurrentLine(newLine);
            setCurrentCursor(0);
            setLines([...lines, currentLine, newLine]);
         }
         for (let i = 0; i < lines.length; i++) {
            console.log(lines[i].sentence);
         }
      };

      const handleOutsideClick = (event) => {
         if (event.target !== cursorRef.current) {
            setCursor(false);
         }
      };

      document.addEventListener("click", handleOutsideClick);

      if (cursor) {
         document.addEventListener("keypress", handleKeyPress);
      }

      return () => {
         document.removeEventListener("keypress", handleKeyPress);
         document.removeEventListener("click", handleOutsideClick);
      };
   }, [
      cursor,
      lines,
      currentCursor,
      currentLineNumber,
      currentLine,
      cursorRef,
      setCursor,
      setLines,
      setCurrentCursor,
      setCurrentLineNumber,
      setCurrentLine,
   ]);

   return (
      <div className="bg-slate-500 h-screen flex flex-col items-center space-y-10">
         <h1 className="text-white text-4xl text-center pt-10">Realtime Text Editor</h1>
         <div
            className="bg-white w-1/2 h-96 flex flex-col"
            onClick={() => {
               setCursor(true);
            }}
            ref={cursorRef}
         >
            {lines.map((line, index) => (
               <h2 key={index} className="flex flex-row">
                  {line.sentence}
                  {/* {cursor && line.lineNumber === currentLineNumber && (
                     <Cursor visible={true} left={currentCursor} />
                  )} */}
               </h2>
            ))}
         </div>
      </div>
   );
}

export default App;
