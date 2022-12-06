import type {UtError, Dropdowns} from '../types';

export default async function unauthenticated(): Promise<Dropdowns> {
    const error: UtError = new Error('This is intentional error');
    error.statusCode = 401;
    throw error;
}
