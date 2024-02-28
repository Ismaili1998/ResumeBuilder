import { arrayRemove, arrayUnion, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import { toast } from "react-toastify";

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

export const saveToCollections = async (user, data) => {
    if (!user?.collections?.includes(data?._id)) {
        try {
            const docRef = doc(db, 'users', user?.uid);
            await updateDoc(docRef, {
                collections: arrayUnion(data?._id), // Should it be data?._id instead of data?.id?
            });
            toast.success('Saved To Collections');
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        }
    } else {
        try {
            const docRef = doc(db, 'users', user?.uid);
            await updateDoc(docRef, {
                collections: arrayRemove(data?._id), // Should it be data?._id instead of data?.id?
            });
            toast.success('Removed from Collections');
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        }

    }
};

export const saveToUserExperiences = async (user, experience) => {
    try {
        const docRef = doc(db, 'users', user?.uid);
        // If experience is not already present, add it
        if (!user?.experiences?.some(exp => exp.id === experience.id)) {

            await updateDoc(docRef, {
                experiences: arrayUnion(experience),
            });
            console.log('Saved To experiences' + experience.id);

            // If experience is already present, update it
        } else {
            await updateDoc(docRef, {
                experiences: user.experiences.map(exp => (exp.id === experience.id ? experience : exp)),
            });
            console.log('Updated successfully' + experience.id);
        }
    } catch (err) {
        toast.error(`Error: ${err.message}`);
    }
};


export const saveToFavourites = async (user, data) => {
    if (!data?.favourites?.includes(user?.uid)) {
        try {
            const docRef = doc(db, 'templates', data?._id);
            await updateDoc(docRef, {
                favourites: arrayUnion(user?.uid), // Should it be data?._id instead of data?.id?
            });
            toast.success('Saved To Favourites');
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        }
    } else {
        try {
            const docRef = doc(db, 'templates', data?._id);
            await updateDoc(docRef, {
                favourites: arrayRemove(user?.uid), // Should it be data?._id instead of data?.id?
            });
            toast.success('Removed from Favourites');
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        }

    }
};

export const getTemplateDetails = async (templateId) => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(doc(db, 'templates', templateId), (doc) => {
            if (doc.exists()) {
                resolve(doc.data());
            } else {
                reject(new Error('Template not found'));
            }
        });
        // Returning the unsubscribe function to allow cleanup
        return unsubscribe;
    });
};



export const getTemplateDetailEditByUser = (uid, id) => {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(db, "users", uid, "resumes", id);
        try {
            // Check if the document exists
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // Document exists, proceed with onSnapshot
                const unsubscribe = onSnapshot(docRef, (doc) => {
                    resolve(doc.data());
                });

                return unsubscribe;
            } else {
                // Document doesn't exist
                const _doc = {
                    resume_id: id
                };
                setDoc(doc(db, "users", uid, "resumes", id), _doc)
                    .catch((err) => {
                        toast.error(`Error : ${err.message}`);
                    });
                resolve([]);
            }
        } catch (error) {
            reject(error);
        }
    });
};
// export const getTemplateDetailEditByUser = (uid, id) => {
//     return new Promise((resolve, reject) => {
//         const unsubscribe = onSnapshot(
//             doc(db, "users", uid, "resumes", id),
//             (doc) => {
//                 resolve(doc.data());
//             }
//         );

//         return unsubscribe;
//     });
// };