document.addEventListener('DOMContentLoaded', function () {
  const userInput = document.getElementById("userInput");
  const submitBtn = document.getElementById("submitBtn");
  const output = document.getElementById("output");
  const copyBtn = document.getElementById("copyBtn");
  const saveBtn = document.getElementById("saveBtn");

  // Copy functionality
  if (copyBtn) {
    copyBtn.addEventListener("click", async function () {
      try {
        const responseText = output.textContent.replace("Response: ", "");
        await navigator.clipboard.writeText(responseText);

        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    });
  }

  // Save functionality
  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      const responseText = output.textContent.replace("Response: ", "");
      const blob = new Blob([responseText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `response-${timestamp}.txt`;

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Visual feedback
      const originalText = saveBtn.textContent;
      saveBtn.textContent = "Saved!";
      setTimeout(() => {
        saveBtn.textContent = originalText;
      }, 2000);
    });
  }

  submitBtn.addEventListener("click", async function () {
    const text = userInput.value;
    if (text.trim() !== "") {
      output.textContent = "Loading...";
      copyBtn.style.display = "none";
      saveBtn.style.display = "none";

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
        copyBtn.style.display = "block";
        saveBtn.style.display = "block";

      } catch (error) {
        output.textContent = `Error: ${error.message}`;
        console.error("Detailed error:", error);
        copyBtn.style.display = "none";
        saveBtn.style.display = "none";
      }
      userInput.value = "";
    } else {
      output.textContent = "Please enter some text!";
      copyBtn.style.display = "none";
      saveBtn.style.display = "none";
    }
  });
});