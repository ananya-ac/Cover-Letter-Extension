const userInput = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");
const output = document.getElementById("output");
const copyBtn = document.getElementById("copyBtn");

// Add copy functionality
copyBtn.addEventListener("click", async function () {
  try {
    // Get the text content without the "Response: " prefix
    const responseText = output.textContent.replace("Response: ", "");
    await navigator.clipboard.writeText(responseText);

    // Provide visual feedback
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
});

submitBtn.addEventListener("click", async function () {
  const text = userInput.value;

  if (text.trim() !== "") {
    output.textContent = "Loading...";
    copyBtn.style.display = "none"; // Hide copy button while loading

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
      copyBtn.style.display = "block"; // Show copy button after response

    } catch (error) {
      output.textContent = `Error: ${error.message}`;
      console.error("Detailed error:", error);
      copyBtn.style.display = "none"; // Hide copy button on error
    }
    userInput.value = "";
  } else {
    output.textContent = "Please enter some text!";
    copyBtn.style.display = "none"; // Hide copy button for empty input
  }
});