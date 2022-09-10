import axios from 'axios';
import { KuCoin } from './types';

export const getKucoinWSConnectionDetails = async () => {
	try {
		const response = await axios.post('https://api.kucoin.com/api/v1/bullet-public');
		return response.data as KuCoin;
	} catch (e) {
		console.log('error getting kucoin ticker ws endpoint', e);
		return null;
	}
}