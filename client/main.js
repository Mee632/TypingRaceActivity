import { DiscordSDK } from "@discord/embedded-app-sdk";

import rocketLogo from '/rocket.png';
import "./style.css";

// Will eventually store the authenticated user's access_token
let auth;

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

setupDiscordSdk().then(() => {
    console.log("Discord SDK is authenticated");
});

async function setupDiscordSdk() {
    await discordSdk.ready();
    console.log("Discord SDK is ready");

    // Authorize with Discord Client
    const { code } = await discordSdk.commands.authorize({
        client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
        response_type: "code",
        state: "",
        prompt: "none",
        scope: [
            "identify",
            "guilds",
        ],
    });

    // Retrieve an access_token from your activity's server
    const response = await fetch("/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code,
        }),
    });
    const { access_token } = await response.json();

    // Authenticate with Discord client (using the access_token)
    auth = await discordSdk.commands.authenticate({
        access_token,
    });

    if (auth == null) {
        throw new Error("Authenticate command failed");
    }
}

document.querySelector('#app').innerHTML = `
  <div>
    <h1>TypeRaceBot</h1>
    <button id="StartGame">Start Race</button>
  </div>
`;

const startGameButton = document.getElementById('StartGame');

// Add a click event listener to the button
startGameButton.addEventListener('click', async () => {
    const response = await fetch('/FilesNeeded/randomquotes_German.json');
    const data = await response.json();
    let words = [];
    for(let i = 0; i < 15; i++) {
        let randomIndex = Math.floor(Math.random() * data.length);
        words.push(data[randomIndex].word);
    }

    const TypingRacePage = `
    <div>
        <h2>Type Race Page</h2>
        <div id="TestText">
            <p id="output"></p>
        </div>
        <div id="textboxContainer">
            <input type="text" id="myTextbox" name="myTextbox" disabled>
        </div>
    </div>
    `;

    // Replace the current content of the #app div with the new page
    document.querySelector('#app').innerHTML = TypingRacePage;

    // Countdown before the race starts
    let countdown = 3;
    let countdownInterval = setInterval(() => {
        document.getElementById("output").innerHTML = countdown;
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            document.getElementById("output").innerHTML = words.join(' ');
            document.getElementById('myTextbox').disabled = false;
            document.getElementById('myTextbox').focus();
        }
    }, 1000);

    let startTime;
    let endTime;

    // Add a keydown event listener to the textbox
    document.getElementById('myTextbox').addEventListener('keydown', function(event) {
        if (!startTime) {
            startTime = new Date();
        }

        // Check if the key pressed was the Enter key
        if (event.key === 'Enter') {
            // Prevent the default action to stop the form from being submitted
            event.preventDefault();

            endTime = new Date();
            let elapsedTime = (endTime - startTime) / 1000; // convert to seconds
            let numWords = words.length;
            let wpm = (numWords / elapsedTime) * 60;
            let userInput = document.getElementById('myTextbox').value;
            let correctWords = words.join(' ');
            let correctCount = 0;
            userInput.split(' ').forEach((word, index) => {
                if (word === correctWords.split(' ')[index]) {
                    correctCount++;
                }
            });
            let accuracy = (correctCount / numWords) * 100;

            // Define the new page
            const TypeRaceResults = `
            <div>
                <h2>New Page</h2>
                <p>Your WPM: ${wpm.toFixed(2)}</p>
                <p>Your Accuracy: ${accuracy.toFixed(2)}%</p>
            </div>
            `;

            // Replace the current content of the #app div with the new page
            document.querySelector('#app').innerHTML = TypeRaceResults;
        }
    });
});