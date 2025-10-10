export async function loginWithPublicToken(publicToken) {
  try {
    const response = await fetch(
      `https://bizuply.com/api/affiliate/login/${publicToken}`,
      {
        method: "GET",
        credentials: "include",        // Important for the cookie to be saved automatically
        headers: { "Accept": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Affiliate not found or server error");
    }

    const data = await response.json();
    return data.success === true;    // Returns true if we logged in successfully

  } catch (error) {
    console.error("Login error:", error.message);
    alert(error.message);
    return false;
  }
}
