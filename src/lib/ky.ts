import { default as ky } from 'ky-universal';
import { defaultKyConfig } from '../config/kyConfig';

export const defaultKyInstance = ky.create(defaultKyConfig);
