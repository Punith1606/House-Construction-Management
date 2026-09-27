const mongoose = require('mongoose');
const { Schema } = mongoose;

const estimateSchema = new Schema({
  userEmail: { type: String },
  projectName: { type: String, default: "My Dream House" },
  lengthu: { type: Number, required: true },
  breadth: { type: Number, required: true },
  floors: { type: Number, default: 1 },
  parking: { type: Number, default: 0 },
  qualityTier: { type: String, default: "standard" },
  totalBuiltUpArea: { type: Number },
  totalProjectCost: { type: Number },
  totalMaterialCost: { type: Number },
  totalLaborCost: { type: Number },
  selectedMaterials: [Schema.Types.Mixed],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Estimate || mongoose.model("Estimate", estimateSchema);
