import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    designNo: { type: String, required: true },
    pcs: { type: Number, required: true },
    size: { type: Number, required: true }, // Replaces mm
    rhodium: { type: String, default: 'no' },
    gold: { type: String, default: 'yes' },
    roseGold: { type: String, default: 'no' },
    category: { type: String, required: true },
    netWeight: { type: Number, required: true },
    imageUrl: { type: String, default: '/placeholder-jewelry.jpg' },
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
export default Item;
