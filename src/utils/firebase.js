import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBhYTsmql69ed0MI3W67x-cdU7SQSRImJA',
  authDomain: 'library-manager-63755.firebaseapp.com',
  projectId: 'library-manager-63755',
  storageBucket: 'library-manager-63755.appspot.com',
  messagingSenderId: '381821886795',
  appId: '1:381821886795:web:b6f4bca43aa058d87948ce',
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
