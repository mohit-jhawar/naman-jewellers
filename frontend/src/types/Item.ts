export interface JewelryItem {
    id: string;
    designNo: string;
    pcs: number;
    size: number;
    rhodium: 'yes' | 'no';
    gold: 'yes' | 'no';
    roseGold: 'yes' | 'no';
    category: 'Bangles' | 'Kada' | 'Ring';
    netWeight: number;
    imageUrl: string;
}
