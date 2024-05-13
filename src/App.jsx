import { useRef, useState, useEffect } from "react";

class Line {
   static currentCursor = 0;
   static currentLineNumber = 0;
   static currentLine = null;

   lineNumber = 0;
   nextLine = null;
   prevLine = null;
   sentence = "";
   constructor(word = "") {
      Line.currentLineNumber++;
      Line.currentLine = this;
      this.lineNumber = Line.currentLineNumber;
      this.nextLine = null;
      this.prevLine = null;
      this.sentence = word;
   }

   addCharacter(character) {
      this.sentence += character;
      Line.currentCursor++;
   }

   deleteCharacter() {
      if (Line.currentCursor > 0) {
         this.sentence =
            this.sentence.substring(0, Line.currentCursor - 1) +
            this.sentence.substring(Line.currentCursor);
         Line.moveCursorLeft();
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

function App() {
   const [cursor, setCursor] = useState(false);
   const [lines, setLines] = useState([]);
   const cursorRef = useRef(null);
   useEffect(() => {
      const handleKeyPress = (event) => {
         const line = new Line("");
         while (event.key !== "Enter") {
            line.addCharacter(event.key);
         }
         setLines([...lines, line]);
         const newLine = new Line("");
         line.addNewLine(newLine);
      };
      if (cursor) {
         cursorRef.current.classList.remove("hidden");
         document.addEventListener("keypress", handleKeyPress);
      }
      const handleClickOutside = (event) => {
         if (!cursorRef.current.contains(event.target)) {
            cursorRef.current.classList.add("hidden");
            setCursor(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("keypress", handleKeyPress);
      };
   }, [cursor]);

   return (
      <div className="bg-slate-500 h-screen flex flex-col items-center space-y-10">
         <h1 className="text-white text-4xl text-center pt-10">Realtime Text Editor</h1>
         <div
            className="bg-white w-1/2 h-96"
            onClick={() => {
               setCursor(true);
            }}
         >
            <span className="text-3xl hidden" ref={cursorRef}>
               I
            </span>
         </div>
      </div>
   );
}

export default App;
