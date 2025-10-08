export async function loginWithPublicToken(publicToken) {
  try {
    const response = await fetch(
      `https://esclick.co.il/api/affiliate/login/${publicToken}`,
      {
        method: "GET",
        credentials: "include",        // חשוב כדי שה-cookie יישמר אוטומטית
        headers: { "Accept": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("משווק לא נמצא או שגיאה בשרת");
    }

    const data = await response.json();
    return data.success === true;    // מחזיר true אם התחברנו בהצלחה

  } catch (error) {
    console.error("שגיאה בכניסה:", error.message);
    alert(error.message);
    return false;
  }
}
