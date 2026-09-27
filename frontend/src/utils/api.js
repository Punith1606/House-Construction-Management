const BACKEND_URL = 'http://localhost:5000';

export async function fetchMarketplaceProducts(username = null) {
  try {
    const url = username 
      ? `${BACKEND_URL}/api/products?username=${username}`
      : `${BACKEND_URL}/api/products`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Backend status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn("Backend API unavailable, using local product catalog:", error.message);
    return [];
  }
}

export async function saveEstimateReport(estimateData) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/estimates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(estimateData)
    });
    if (!res.ok) throw new Error(`Backend status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn("Backend API unavailable:", error.message);
    return { success: false, message: error.message };
  }
}
