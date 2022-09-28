var firebaseConfig = {
  apiKey: "AIzaSyDPTnfptN1f6VVz6be1yx4tScjUb1SLTJ8",
  authDomain: "math-club-53f23.firebaseapp.com",
  databaseURL: "https://math-club-53f23-default-rtdb.firebaseio.com",
  projectId: "math-club-53f23",
  storageBucket: "math-club-53f23.appspot.com",
  messagingSenderId: "353417583110",
  appId: "1:353417583110:web:a02b204bd552062c6ac187",
  measurementId: "G-LVC8Q5W12S",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();

let messages = db.collection("messages").doc("message");
let messagelist;
let messagejson;
let messagejsonstring;
let username = "";

auth.signOut();
let signed = false;

function getData(jsonString) {
  let json = JSON.parse(jsonString);
  let list = ``;
  for (let i = 0; i < Object.keys(json).length; i++) {
    console.log(i);
    console.log(json);
    console.log(json[i]);
    console.log(json[0]);
    list += `<li>${json[i][1]} : ${json[i][0]}</li>`;
  }
  return list;
}

async function updateData() {
  messagelist = await messages.get();
  messagejson = await messagelist.data();
  messagejsonstring = JSON.stringify(messagejson);
  document.getElementById("user").innerHTML = getData(messagejsonstring);
}

function modifyjson(jsonString) {
  let json = JSON.parse(jsonString);
  for (let i = 0; i < Object.keys(json).length - 1; i++) {
    json[i] = json[i + 1];
  }
  delete json[Object.keys(json).length - 1];
  return json;
}

document.addEventListener("keyup", async (e) => {
  if (e.code === "Enter") {
    if (signed) {
      messagelist = await messages.get();
      messagejson = await messagelist.data();
      messagejsonstring = JSON.stringify(messagejson);
      let messag = document.getElementById("box").value;
      document.getElementById("box").value = "";
      messagejson[Object.keys(messagejson).length] = [messag, username];
      while (Object.keys(messagejson).length > 25) {
        messagejson = modifyjson(JSON.stringify(messagejson));
        console.log(messagejson);
      }
      messages.set(messagejson);
    } else {
      alert("you have to be signed in");
    }
  }
});

document.getElementById("signInBtn").addEventListener("click", () => auth.signInWithPopup(provider));
document.getElementById("signOutBtn").addEventListener("click", () => auth.signOut());

async function signedIn() {
  console.log("signed in");
  document.getElementById("whenSignedIn").hidden = false;
  document.getElementById("whenSignedOut").hidden = true;
  updateData();
  //document.getElementById('user').innerHTML = `<h3>Hello ${username}!</h3>`;
}

async function signedOut() {
  console.log("signed out");
  document.getElementById("whenSignedIn").hidden = true;
  document.getElementById("whenSignedOut").hidden = false;
  document.getElementById("user").innerHTML = ``;
}

messages.onSnapshot(async (docSnapshot) => {
  updateData();
});

auth.onAuthStateChanged(async (user) => {
  signed = user;
  if (user) {
    username = await user.displayName;
    signedIn();
  } else {
    username = "";
    signedOut();
  }
});
