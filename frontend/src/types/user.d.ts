import type { WalletType } from './global';
export interface User {
    no?: number;
    id: string;
    name: string;
    username: string;
    point: number;
    role: string;
    tier?: string;
    exp?: number;
    wallet: WalletType;
    retrieval_at?: string;
}


export interface UserGuast {
    id: string;
    name: string;
    username: string;
}