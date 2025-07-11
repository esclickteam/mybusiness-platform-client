export async function loginWithPublicToken(publicToken) {
  try {
    const response = await fetch(`https://esclick.co.il/api/affiliate/login/${publicToken}`);
    if (!response.ok) {
      throw new Error("משווק לא נמצא או שגיאה בשרת");
    }
    const data = await response.json();
    localStorage.setItem("affiliateToken", data.token);
    return data.token;
  } catch (error) {
    console.error("שגיאה בכניסה:", error.message);
    alert(error.message);
  }
}
