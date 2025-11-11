import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAlgR0kToLbyN3L9_W_ZO17c6ZDwhI3VII',
	authDomain: 'test-native-fac.firebaseapp.com',
	projectId: 'test-native-fac',
	storageBucket: 'test-native-fac.firebasestorage.app',
	messagingSenderId: '76945684251',
	appId: '1:76945684251:web:64eb33eee4daba5b2f05be',
	measurementId: 'G-PPJHP6M5HQ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
