import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";


export const getUserDetail = () => {

    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((userCred) => {
            if (userCred) {
                const userData = userCred.providerData[0];
                const unsubscribe = onSnapshot(doc(db, "users", userData?.uid), (_doc) => {
                    if (_doc.exists()) {
                        resolve(_doc.data());
                    } else {
                        setDoc(doc(db, "users", userData?.uid), userData).then(() => {
                            resolve(userData);
                        });
                    }
                });
                return unsubscribe
            }
            else {
                reject(new Error("User is not authenticated"));
            }
            unsubscribe();
            // const unsubscribe = onSnapshot()
        });
    });
};

export const getTemplates = () => {
    return new Promise((resolve, reject) => {
        const templateQuery = query(
            collection(db, 'templates'),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
            const templates = querySnap.docs.map(doc => doc.data());
            resolve(templates);
        }, (error) => {
            reject(error); // Reject the promise in case of an error
        });

        // Returning the unsubscribe function to detach the listener when necessary
        return unsubscribe;
    });
};