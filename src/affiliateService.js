export async function loginWithPublicToken(publicToken) {
  try {
    const response = await fetch(
      `https://BizUply.co.il/api/affiliate/login/${publicToken}`,
      {
        method: "GET",
        credentials: "include",        // Important so the cookie is saved automatically
        headers: { "Accept": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Affiliate not found or server error");
    }

    const data = await response.json();
    return data.success === true;    // Returns true if login was successful

  } catch (error) {
    console.error("Login error:", error.message);
    alert(error.message);
    return false;
  }
}
