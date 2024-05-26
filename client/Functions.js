const moment = require('moment');

function calculateWpm(startTime, endTime, numWords) {
    let elapsedTime = endTime - startTime;
    let minutes = elapsedTime / 60;
    let wpm = numWords / minutes;
    return Math.round(wpm * 100) / 100;
}

function calculateCorrectness(userInput, correctSentence) {
    let userWords = userInput.split(' ');
    let correctWords = correctSentence.split(' ');
    let correctCount = 0;
    for (let i = 0; i < userWords.length; i++) {
        if (userWords[i] === correctWords[i]) {
            correctCount++;
        }
    }
    return (correctCount / correctWords.length) * 100;
}

function underlineErrors(userInput, correctSentence) {
    let userWords = userInput.split(' ');
    let correctWords = correctSentence.split(' ');
    let underlinedSentence = [];
    for (let i = 0; i < userWords.length; i++) {
        if (userWords[i] === correctWords[i]) {
            underlinedSentence.push(userWords[i]);
        } else {
            underlinedSentence.push(`__${userWords[i]}__`);
        }
    }
    return underlinedSentence.join(' ');
}

function update_user_progress(userdata, uid, wpm, accuracy, language) {
    // This function requires a MongoDB driver to interact with the database
    // The implementation will depend on the specific driver you are using
}

function calculateXpGain(wpm, accuracy) {
    return Math.round((wpm * accuracy) / 100);
}

function calculateLevel(xp) {
    return Math.floor(xp / 100) + 1;
}