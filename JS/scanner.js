const resultBox = document.getElementById("scan-result");

let scanner;

function showResult(title, message, type = "") {
    resultBox.className = `scan-result ${type}`;
    resultBox.innerHTML = `
        <strong>${title}</strong>
        <p>${message}</p>
    `;
}

function onScanSuccess(decodedText) {
    // Stop scanning after detecting a code.
    scanner.clear();

    showResult(
        "QR CODE DETECTED",
        `Scanned code: ${decodedText}`,
        "success"
    );

    console.log("Scanned ticket:", decodedText);
}

function onScanFailure(error) {
    // Ignore unsuccessful frames while the camera is scanning.
}

scanner = new Html5QrcodeScanner(
    "reader",
    {
        fps: 10,
        qrbox: { width: 230, height: 230 },
        aspectRatio: 1
    },
    false
);

scanner.render(onScanSuccess, onScanFailure);
