export interface Segment {
    id?: string;
    name: string;
    description: string;
    created_at?: string;
    updated_at?: string;
}

export interface ShopperProfile {
    id?: string;
    customer_id: number;
    created_at?: string;
    updated_at?: string;
}