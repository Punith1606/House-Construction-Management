/**
 * Civil Engineering House Construction Cost & Material Calculator Engine (Backend)
 */

const MATERIAL_FACTORS = {
  "Cement": { factor: 0.40, unit: "Bags", defaultPrice: 380, icon: "🧱" },
  "Steel Rebars": { factor: 4.00, unit: "Kg", defaultPrice: 68, icon: "⚡" },
  "Bricks/Blocks": { factor: 10.00, unit: "Nos", defaultPrice: 9.5, icon: "🧩" },
  "Gravel & Sand": { factor: 2.60, unit: "Cubic ft", defaultPrice: 50, icon: "🪨" },
  "Flooring Tiles": { factor: 1.15, unit: "Sq ft", defaultPrice: 65, icon: "🔲" },
  "Paint & Primers": { factor: 0.15, unit: "Liters", defaultPrice: 260, icon: "🎨" },
  "Wiring & Cables": { factor: 1.50, unit: "Meters", defaultPrice: 38, icon: "🔌" },
  "Switches & Sockets": { factor: 0.15, unit: "Units", defaultPrice: 130, icon: "💡" },
  "Wood": { factor: 0.08, unit: "Cubic ft", defaultPrice: 1250, icon: "🚪" },
  "Plumbing": { factor: 0.05, unit: "Points", defaultPrice: 380, icon: "🚰" }
};

const QUALITY_TIERS = {
  economy: {
    name: "Economy",
    description: "Budget-friendly, durable materials & basic finish",
    costMultiplier: 0.85,
    laborRatePerSqFt: 320
  },
  standard: {
    name: "Standard",
    description: "Balanced premium grade, branded fittings & standard finish",
    costMultiplier: 1.0,
    laborRatePerSqFt: 420
  },
  premium: {
    name: "Premium / Luxury",
    description: "Top-tier luxury materials, custom teak wood & designer finishes",
    costMultiplier: 1.35,
    laborRatePerSqFt: 580
  }
};

const CONSTRUCTION_STAGES = [
  { name: "Excavation & Foundation", percentage: 15, color: "#3B82F6", icon: "🏗️" },
  { name: "RCC Structure & Frame", percentage: 35, color: "#8B5CF6", icon: "🏛️" },
  { name: "Masonry & Plastering", percentage: 20, color: "#EC4899", icon: "🧱" },
  { name: "Flooring & Tiling", percentage: 12, color: "#10B981", icon: "🔲" },
  { name: "Electrical & Plumbing", percentage: 10, color: "#F59E0B", icon: "⚡" },
  { name: "Painting & Finishing", percentage: 8, color: "#06B6D4", icon: "🎨" }
];

function calculateConstructionEstimate(buildingData, selectedCartItems = []) {
  const length = Number(buildingData.lengthu) || 0;
  const breadth = Number(buildingData.breadth) || 0;
  const floors = Number(buildingData.floors) || 1;
  const parkingArea = Number(buildingData.parking) || 0;
  const qualityKey = buildingData.qualityTier || 'standard';
  const tierConfig = QUALITY_TIERS[qualityKey] || QUALITY_TIERS.standard;

  const plotArea = length * breadth;
  const totalBuiltUpArea = plotArea * floors;
  const indoorFlooringArea = Math.max(0, (plotArea - parkingArea)) + (plotArea * (floors - 1));

  const selectedCartMap = {};
  if (Array.isArray(selectedCartItems)) {
    selectedCartItems.forEach(item => {
      if (item && item.productCategory) {
        selectedCartMap[item.productCategory.trim()] = item;
      }
    });
  }

  let totalMaterialCost = 0;

  const materialBreakdown = Object.entries(MATERIAL_FACTORS).map(([category, factorInfo]) => {
    let quantity = category === "Flooring Tiles"
      ? Math.ceil(indoorFlooringArea * factorInfo.factor)
      : Math.ceil(totalBuiltUpArea * factorInfo.factor);

    const cartProduct = selectedCartMap[category] || selectedCartMap[category.trim()];

    let unitPrice = factorInfo.defaultPrice * tierConfig.costMultiplier;
    let productName = `${category} (Standard Grade)`;
    let source = "Benchmark Rate";
    let isSelectedFromMarketplace = false;

    if (cartProduct) {
      unitPrice = Number(cartProduct.price) || unitPrice;
      productName = cartProduct.productName || category;
      source = cartProduct.distributerName ? `Distributor: ${cartProduct.distributerName}` : "Marketplace";
      isSelectedFromMarketplace = true;
    }

    const categoryTotalCost = Math.round(quantity * unitPrice);
    totalMaterialCost += categoryTotalCost;

    return {
      category,
      productName,
      quantity,
      unit: factorInfo.unit,
      unitPrice: Math.round(unitPrice),
      totalPrice: categoryTotalCost,
      icon: factorInfo.icon,
      source,
      isSelectedFromMarketplace
    };
  });

  const totalLaborCost = Math.round(totalBuiltUpArea * tierConfig.laborRatePerSqFt);
  const estimatedArchitectFees = Math.round(totalBuiltUpArea * 35 * tierConfig.costMultiplier);
  const totalProjectCost = totalMaterialCost + totalLaborCost + estimatedArchitectFees;

  const stageBreakdown = CONSTRUCTION_STAGES.map(stage => ({
    ...stage,
    amount: Math.round(totalProjectCost * (stage.percentage / 100))
  }));

  return {
    plotArea,
    totalBuiltUpArea,
    indoorFlooringArea,
    floors,
    parkingArea,
    qualityTier: tierConfig,
    materialBreakdown,
    totalMaterialCost,
    totalLaborCost,
    estimatedArchitectFees,
    totalProjectCost,
    stageBreakdown,
    costPerSqFt: Math.round(totalProjectCost / (totalBuiltUpArea || 1))
  };
}

module.exports = {
  MATERIAL_FACTORS,
  QUALITY_TIERS,
  CONSTRUCTION_STAGES,
  calculateConstructionEstimate
};
