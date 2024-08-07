import { Router } from 'express';
import { createWatchData, getWatchData, updateWatchData } from '../../controllers/Patient/watchDataController';

export default (router: Router) => {
    router.post('/watchdata', createWatchData);
    router.get('/watchdata/:patient_id', getWatchData);
    router.put('/updateWatchdata/:patientId', updateWatchData); 
};
