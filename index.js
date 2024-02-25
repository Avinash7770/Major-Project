const startRecordingButton = document.getElementById('start_recording');
const finishRecordingButton = document.getElementById('finish_recording');
const clearTextButton = document.getElementById('clear_text');
const convertText = document.getElementById('convert_text');

let recognition;
let isProcessingResult = false;

startRecordingButton.addEventListener('click', function () {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = true;

    recognition.addEventListener('result', handleRecognitionResult);

    recognition.addEventListener('end', function () {
        // Automatically restart recognition when it ends (unless Finish is clicked)
        if (!finishRecordingButton.disabled) {
            recognition.start();
        }
    });

    recognition.start();

    // Disable the Start button once recording has begun
    startRecordingButton.disabled = true;
});

finishRecordingButton.addEventListener('click', function () {
    if (recognition) {
        recognition.stop();
        recognition.removeEventListener('result', handleRecognitionResult);
        startRecordingButton.disabled = false; // Enable the Start button when recording is finished
    }
});

clearTextButton.addEventListener('click', function () {
    convertText.value = ''; // Clear the text
});

document.getElementById('Question').value = 'How are you feeling today?';

function handleRecognitionResult(e) {
    // Check if the result is final
    if (e.results[e.results.length - 1].isFinal) {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        // Process the result only if we are not currently processing one
        if (!isProcessingResult) {
            isProcessingResult = true;
            convertText.value += ' ' + transcript;
            console.log(transcript);

            // Reset the flag after a short delay to allow for the next recognition result
            setTimeout(() => {
                isProcessingResult = false;
            }, 500);
        }
    }
}


