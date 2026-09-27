const Estimate = require('../models/Estimate');
const { calculateConstructionEstimate } = require('../utils/constructionCalculator');

const createEstimate = async (req, res) => {
  try {
    const data = req.body;
    const computed = calculateConstructionEstimate(data, data.selectedMaterials || []);
    
    const estimateDoc = await Estimate.create({
      ...data,
      totalBuiltUpArea: computed.totalBuiltUpArea,
      totalProjectCost: computed.totalProjectCost,
      totalMaterialCost: computed.totalMaterialCost,
      totalLaborCost: computed.totalLaborCost
    });

    return res.status(201).json({ success: true, estimateId: estimateDoc._id, computed });
  } catch (error) {
    console.error("Create Estimate Error:", error.message);
    return res.status(500).json({ error: "Failed to save estimate" });
  }
};

const getEstimates = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.json([]);
    }
    const estimates = await Estimate.find({ userEmail: email }).sort({ createdAt: -1 });
    return res.json(estimates);
  } catch (error) {
    console.error("Get Estimates Error:", error.message);
    return res.json([]);
  }
};

module.exports = {
  createEstimate,
  getEstimates
};
