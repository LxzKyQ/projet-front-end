let mediaRecorder;
let recordedBlobs;

document.addEventListener("DOMContentLoaded", async () => {
    // elements html
    const errorMsgElement = document.querySelector('span#errorMsg');
    const recordedVideo = document.querySelector('video#recorded');
    const recordButton = document.querySelector('button#record');

    recordButton.addEventListener('click', () => {
        if (recordButton.textContent === "Commencer l'enregistrement") {
            startRecording(); // commencer l'enregistrement
        } else {
            stopRecording(); // stopper l'enregistrement
            recordButton.textContent = "Commencer l'enregistrement"; // inverser l'effet du bouton (stop->commencer)
            playButton.disabled = false;
            downloadButton.disabled = false;
        }
    });

    const playButton = document.querySelector('button#play'); // bouton jouer la vidéo enregistrée
    playButton.addEventListener('click', () => {
        const mimeType = "video/mp4";
        const superBuffer = new Blob(recordedBlobs, { type: mimeType });
        recordedVideo.src = null;
        recordedVideo.srcObject = null;
        recordedVideo.src = window.URL.createObjectURL(superBuffer);
        recordedVideo.controls = true;
        recordedVideo.play();
    });

    const downloadButton = document.querySelector('button#download');
    downloadButton.addEventListener('click', () => { // bouton télécharger
        const blob = new Blob(recordedBlobs, { type: 'video/mp4' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.mp4';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    });

    function handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    function startRecording() {
        recordedBlobs = [];
        const mimeType = "video/webm;codecs=vp9,opus";
        const options = { mimeType };

        try {
            mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e) {
            console.error('Exception while creating MediaRecorder:', e);
            errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
            return;
        }

        recordButton.textContent = "Arreter l'enregistrement"; // inverser l'effet du bouton (commencer->stopper)
        playButton.disabled = true;
        downloadButton.disabled = true;
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();
    }

    function stopRecording() {
        mediaRecorder.stop();
    }

    function handleSuccess(stream) {
        recordButton.disabled = false; // activer le bouton de lancement de la video
        window.stream = stream;

        const gumVideo = document.querySelector('video#gum');
        gumVideo.srcObject = stream; // camera montré en temps réel
    }

    async function init(constraints) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleSuccess(stream);
        } catch (e) {
            errorMsgElement.innerHTML = `Get UserMedia error:${e.toString()}`;
        }
    }

    document.querySelector('button#start').addEventListener('click', async () => {
        document.querySelector('button#start').disabled = true; // desactiver le bouton d'activation de camera
        const constraints = {
            audio: {
                echoCancellation: { exact: false }
            },
            video: {
                width: 1280, height: 720
            }
        };
        await init(constraints);
    });

    // afficher la memoire restante
    document.getElementById('result').innerHTML = navigator.deviceMemory ?? 'unknown'
    setTimeout(() => { // répéter la même action toutes les 10 secondes
        document.getElementById('result').innerHTML = navigator.deviceMemory ?? 'unknown'
    }, 10000);
})