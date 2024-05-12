import { useRef, useState, useEffect } from "react";

function App() {
   const [cursor, setCursor] = useState(false);
   const [text, setText] = useState("");
   const cursorRef = useRef(null);
   useEffect(() => {
      if (cursor) {
         cursorRef.current.classList.remove("hidden");
      }
   }, [cursor]);

   const handleClickOutside = (event) => {
      if (!cursorRef.current.contains(event.target)) {
         cursorRef.current.classList.add("hidden");
         setCursor(false);
      }
   };

   return (
      <div className="bg-slate-500 h-screen flex flex-col items-center space-y-10">
         <h1 className="text-white text-4xl text-center pt-10">Realtime Text Editor</h1>
         <div
            className="bg-white w-1/2 h-96"
            onClick={() => {
               setCursor(true);
               document.addEventListener("mousedown", handleClickOutside);
            }}
         >
            <span className="text-3xl hidden" ref={cursorRef}>
               {text}I
            </span>
         </div>
      </div>
   );
}

export default App;
