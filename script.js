const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

let mediaRecorder;
let stream;
let audioChunks = [];

stopBtn.disabled = true;

// mediaRecorderとstreamの技術知識
// MediaRecorderは、ブラウザのMediaStreamを録音するためのAPIです。MediaStreamは、ユーザーのマイクやカメラなどのメディアデバイスからのストリームを表します。
// MediaRecorderを使用することで、これらのストリームを録音し、後で再生や保存が可能な形式で取得できます。
// 1. MediaRecorderの作成: MediaRecorderは、MediaStreamを引数に取って作成されます。例えば、ユーザーのマイクからのストリームを取得してMediaRecorderを作成することができます。
// 2. 録音の開始と停止: MediaRecorderには、録音を開始するstart()メソッドと、録音を停止するstop()メソッドがあります。録音が停止されると、録音されたデータが利用可能になります。
// 3. データの取得: MediaRecorderは、録音されたデータをチャンク（小さな部分）として提供します。これらのチャンクは、dataavailableイベントで取得できます。
// 録音が停止されると、これらのチャンクを組み合わせて完全なオーディオファイルを作成することができます。
// 4. 録音の保存や再生: 録音されたデータは、Blobオブジェクトとして取得されます。
// これをURL.createObjectURL()を使用してURLに変換し、オーディオプレーヤーで再生したり、ファイルとして保存することができます。
// これらの技術を組み合わせることで、ユーザーはブラウザ上で簡単に音声を録音し、再生や保存ができるようになります。

startBtn.addEventListener("click", async () => {

  audioChunks = [];

  if (!stream) {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  }

  if (!mediaRecorder) {
    mediaRecorder = new MediaRecorder(stream);
  } 

  mediaRecorder.onstop = () => {
    console.log(audioChunks);

    //const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    const audioBlob = new Blob(audioChunks, { type: "audio/webm;codecs=opus" });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    renderRecording(audioUrl);
  };

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) { 
      audioChunks.push(event.data);
    }
  };

  mediaRecorder.start(1000); // 1秒ごとにデータをavailableイベントで取得

  startBtn.disabled = true;
  stopBtn.disabled = false;
});

stopBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

function renderRecording(audioUrl) {
  const recordingsList = document.getElementById("recordingsList");

  const listItem = document.createElement("li");
  const audio = document.createElement("audio");

  audio.controls = true;
  audio.src = audioUrl;

  listItem.appendChild(audio);
  recordingsList.appendChild(listItem);
}