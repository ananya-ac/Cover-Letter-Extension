const userInput = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");
const output = document.getElementById("output");

submitBtn.addEventListener("click", async function() {
  const text = userInput.value;
  
  if (text.trim() !== "") {
    output.textContent = "Loading...";
    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": chrome.runtime.getURL(""),
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          model: "llama3.2",
          prompt: text,
          stream: false,
          system: "You are an expert in writing cover letters. You're prompted using a job description. You will use this description to write a relevant cover letter for that job posting."
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      output.textContent = `Response: ${data.response}`;
    } catch (error) {
      output.textContent = `Error: ${error.message}`;
      console.error("Detailed error:", error);
    }
    userInput.value = "";
  } else {
    output.textContent = "Please enter some text!";
  }
});