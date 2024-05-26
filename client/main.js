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

// Get the Start Game button
const startGameButton = document.getElementById('StartGame');

// Add a click event listener to the button
startGameButton.addEventListener('click', () => {
    // Create a new page
    const TypingRacePage = `
    <div>
        <h2>Type Race Page</h2>
        <div id="TestText">
            <p>Test</p>
        </div>
        <div id="textboxContainer">
            <input type="text" id="myTextbox" name="myTextbox">
        </div>
    </div>
`;

    // Replace the current content of the #app div with the new page
    document.querySelector('#app').innerHTML = TypingRacePage;

    // Add a keydown event listener to the textbox
    document.getElementById('myTextbox').addEventListener('keydown', function(event) {
        // Check if the key pressed was the Enter key
        if (event.key === 'Enter') {
            // Prevent the default action to stop the form from being submitted
            event.preventDefault();

            // Define the new page
            const TypeRaceResults = `
            <div>
                <h2>New Page</h2>
                <p>Welcome to the new page!</p>
            </div>
            `;

            // Replace the current content of the #app div with the new page
            document.querySelector('#app').innerHTML = TypeRaceResults;
        }
    });
});