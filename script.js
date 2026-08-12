document.addEventListener("DOMContentLoaded", function () {

    // Find the message textarea
    const messageBox = document.querySelector("textarea");

    // Find Analyze Message button
    const analyzeButton = Array.from(document.querySelectorAll("button"))
        .find(button =>
            button.textContent.toLowerCase().includes("analyze message")
        );

    if (!messageBox || !analyzeButton) {
        console.error("Message box or Analyze button not found.");
        return;
    }

    // Character counter
    const counter = Array.from(document.querySelectorAll("*"))
        .find(element =>
            element.textContent.trim() === "0 characters"
        );

    messageBox.addEventListener("input", function () {

        if (counter) {
            counter.textContent = `${messageBox.value.length} characters`;
        }

    });

    // Analyze message
    analyzeButton.addEventListener("click", function () {

        const message = messageBox.value.trim();

        if (message.length === 0) {
            alert("Please enter a message to analyze.");
            return;
        }

        const text = message.toLowerCase();

        // Scam indicators
        const scamWords = [
            "urgent",
            "immediately",
            "verify",
            "verification",
            "otp",
            "password",
            "click this link",
            "click the link",
            "won",
            "winner",
            "prize",
            "lottery",
            "claim",
            "blocked",
            "suspended",
            "kyc",
            "bank account",
            "account will be",
            "send money",
            "refund",
            "free money"
        ];

        // Suspicious indicators
        const suspiciousWords = [
            "offer",
            "limited time",
            "confirm",
            "update your account",
            "reward",
            "cashback",
            "gift",
            "http://",
            "https://",
            "bit.ly",
            "tinyurl"
        ];

        let scamScore = 0;
        let suspiciousScore = 0;

        scamWords.forEach(word => {
            if (text.includes(word)) {
                scamScore++;
            }
        });

        suspiciousWords.forEach(word => {
            if (text.includes(word)) {
                suspiciousScore++;
            }
        });

        // Check for links
        const hasLink = /(https?:\/\/|www\.|bit\.ly|tinyurl)/i.test(message);

        if (hasLink) {
            scamScore += 2;
        }

        // Calculate result
        let result;
        let confidence;

        if (scamScore >= 4) {

            result = "SCAM DETECTED";
            confidence = Math.min(98, 75 + scamScore * 4);

        } else if (scamScore >= 2 || suspiciousScore >= 2) {

            result = "SUSPICIOUS MESSAGE";
            confidence = Math.min(90, 60 + suspiciousScore * 5);

        } else {

            result = "LIKELY SAFE";
            confidence = Math.min(95, 85 + suspiciousScore * 2);

        }

        // Find result area
        let resultArea = document.getElementById("analysis-result");

        // If result area doesn't exist, create one
        if (!resultArea) {

            resultArea = document.createElement("div");

            resultArea.id = "analysis-result";

            resultArea.style.marginTop = "20px";
            resultArea.style.padding = "25px";
            resultArea.style.borderRadius = "18px";
            resultArea.style.background = "#f5f5ff";
            resultArea.style.border = "1px solid #ddd";
            resultArea.style.textAlign = "center";

            analyzeButton.parentElement.appendChild(resultArea);
        }

        // Display result
        resultArea.innerHTML = `
            <h2>${result}</h2>

            <p>
                <strong>AI Confidence:</strong> ${confidence}%
            </p>

            <p>
                <strong>Risk Indicators Found:</strong>
                ${scamScore + suspiciousScore}
            </p>

            <p>
                <strong>Link Detected:</strong>
                ${hasLink ? "Yes ⚠️" : "No"}
            </p>

            <hr>

            <p>
                ${result === "SCAM DETECTED"
                    ? "⚠️ This message contains multiple scam indicators. Do not click suspicious links or share OTP/passwords."
                    : result === "SUSPICIOUS MESSAGE"
                    ? "⚠️ This message has some suspicious characteristics. Verify the sender before taking any action."
                    : "✅ No major scam indicators were detected. Still verify unexpected messages before trusting them."
                }
            </p>
        `;

        // Scroll to result
        resultArea.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

});