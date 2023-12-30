import { default as ky } from 'ky-universal';
import { generalizedKyConfig } from '../config/kyConfig';

export const generalizedKyInstance = ky.create(generalizedKyConfig);
