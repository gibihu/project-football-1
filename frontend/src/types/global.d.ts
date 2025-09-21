import { UserGuast } from './user';

export interface PackType {
    id: string,
    sort_no: number;
    points: number;
    price: number;
    price_per_point?: number;
    published?: number;
    is_promo: number;
    promo_title: string;
    note: string;
}

export interface TransactionType{
    id: string;
    user_id: string;
    package_id: string;
    user_reference?: string;
    reference_code?: string;
    payment_method: string;
    amount: number;
    points: number;
    currency?: string;
    status: string;
    slip_url?: string;
    paid_at?: string;
    approved_at: string;
    expired_at: string;
    updated_at: string;
    created_at: string;
    gateway?: string;
    gateway_txn_id?: string;
    raw_response?: string;
}


export interface WalletHistoryType {
    id: string;
    wallet_id: string;
    change_amount: number;
    role: string;
    type: string;
    description?: string;
    updated_at: string;
    created_at: string;
}

export interface WalletType {
    id: string;
    points: number;
    income: number;
    updated_at: string;
    created_at: string;
}


export interface PostType {
    id: string;
    user_id: string;
    user: UserGuast;
    title: string;
    contents: string;
    points: number;
    status: string;
    updated_at: string;
    created_at: string;
}