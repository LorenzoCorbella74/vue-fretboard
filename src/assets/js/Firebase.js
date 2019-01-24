import firebase from 'firebase/app'
import 'firebase/firestore'

const settings = {
    // timestampsInSnapshots: true
};

var config = {
    apiKey: "AIzaSyBa5cwuiR2tjXYWT4d0c_SVlT4alj7ZevE",
    authDomain: "guitarstudies-ae4fd.firebaseapp.com",
    databaseURL: "https://guitarstudies-ae4fd.firebaseio.com",
    projectId: "guitarstudies-ae4fd",
    storageBucket: "guitarstudies-ae4fd.appspot.com",
    messagingSenderId: "439001851726"
};
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;