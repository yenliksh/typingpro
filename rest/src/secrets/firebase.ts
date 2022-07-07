import { ServiceAccount } from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const firebaseSecrets = JSON.parse(process.env.FIREBASE_ADMIN_CONTENTS ?? '');

export default firebaseSecrets as ServiceAccount;
