export interface FormData {
    description: string;
    isVisible: boolean;
    name: string;
    price: number;
    type: string;
}

export interface TableItem {
    id: number;
    name: string;
    price: number;
    stock: number;
}

export interface CustomerItem {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    shopper_profile_id?: string;
    segment_ids?: string[];
}

export interface SegmentTableItem {
    id: string;
    name: string
}

export interface ListItem extends FormData {
    id: number;
}

export interface StringKeyValue {
    [key: string]: string;
}
