import { HttpStatusCode } from '@/constants/http';

export const isAuthFailureStatus = (status?: number): boolean => {
    return status === HttpStatusCode.UNAUTHORIZED || status === HttpStatusCode.FORBIDDEN;
};
