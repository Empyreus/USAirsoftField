import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/functions';
require('dotenv').config();

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.database();
        this.st = app.storage();
        this.func = app.functions();
    }
    // *** Auth API ***
    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);
    
    doEmailUpdate = email => 
        this.auth.currentUser.updateEmail(email)

    // *** Merge Auth and DB User API *** //
    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.user(authUser.uid)
                    .once('value')
                    .then(snapshot => {
                        const dbUser = snapshot.val();
                        // default empty roles
                        if (!dbUser.roles) {
                            dbUser.roles = [];
                        }
                        // merge auth and db user
                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,
                            ...dbUser,
                        };
                        next(authUser);
                    });
            } else {
                fallback();
            }
        });

    // Functions API

    createTeam = () => this.func.httpsCallable('createTeam');

    manageTeam = () => this.func.httpsCallable('manageTeam');

    acceptRequest = () => this.func.httpsCallable('acceptRequest');

    kickMember = () => this.func.httpsCallable('kickMember');

    quitTeam = () => this.func.httpsCallable('quitTeam');

    disbandTeam = () => this.func.httpsCallable('disbandTeam');

    requestTeam = () => this.func.httpsCallable('requestTeam');

    mergeUsers = () => this.func.httpsCallable('mergeUsers');

    sendMail = () => this.func.httpsCallable('sendMail');

    createPrivilegedUser = () => this.func.httpsCallable('createPrivilegedUser');

    emailOptMenu = () => this.func.httpsCallable('emailOptMenu');

    manageProfile = () => this.func.httpsCallable('manageProfile');

    testRenewal = () => this.func.httpsCallable('testRenewal');

    // Storage Database API

    membersWaivers = pdf => this.st.ref().child(`waivers/members/${pdf}`);

    nonmembersWaivers = pdf => this.st.ref().child(`waivers/non-members/${pdf}`);

    waiversList = () => this.st.ref().child(`waivers/non-members`);

    pictures = img => this.st.ref().child(`images/${img}`);

    teamsPictures = img => this.st.ref().child(`teams/${img}`);

    emailAttachment = () => this.st.ref().child('email/emailattachment.png');

    // User API

    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');

    // Email List API

    emailList = (email) => this.db.ref(`emaillist/${email}`)

    emailListMembers = (secret) => this.db.ref(`emaillist/members/${secret}`);

    emailListNonMembers = (secret) => this.db.ref(`emaillist/non-members/${secret}`);

    grabEmailListM = () => this.db.ref(`emaillist/members`);

    grabEmailListNM = () => this.db.ref(`emaillist/non-members`);


    // Team API

    team = name => this.db.ref(`teams/${name}`);

    teams = () => this.db.ref(`teams`);

    // UID API

    uid = () => this.auth.currentUser.uid;

}

export default Firebase;