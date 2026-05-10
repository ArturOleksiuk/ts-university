export interface Category {
    id: number;
    name: string;
    shortname: string;
    notes: string;
}

export interface Product {
    id: number;
    name: string;
    shortname: string;
    description: string;
    price: number;
}

export interface CategoryData {
    categoryName: string;
    items: Product[];
}
