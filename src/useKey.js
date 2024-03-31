import { useEffect } from "react";

export function useKey(key, action) {
  /* The below code is a React useEffect hook that adds an event listener for the "keydown" event on the
document. When a key is pressed, it checks if the key code is "Escape". If the Escape key is
pressed, it calls the onClosebtn function and logs "closing" to the console. The useEffect hook also
returns a cleanup function that removes the event listener when the component unmounts or when the
onClosebtn function changes. */
  useEffect(() => {
    function callback(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
        console.log("closing");
      } else {
        console.log("not closing, different keydown");
      }
    }
    // Attaching Event Listener
    document.addEventListener("keydown", callback);

    // Cleanup Function to remove Event Listener
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [key, action]);
}
