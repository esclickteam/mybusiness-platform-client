import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // שליפת ה-params מה-URL
import checkFeatureAvailability from './FeatureAvailability';

const BusinessPage = () => {
    const { businessId } = useParams(); // קבלת מזהה העסק מתוך ה-URL
    const [business, setBusiness] = useState(null);
    const [userPlan, setUserPlan] = useState('free'); // או כל מנוי אחר שאתה מגדיר
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // תהליך טעינת המידע של העסק מהשרת
        const fetchBusinessData = async () => {
            try {
                const response = await fetch(`/api/business/${businessId}`);
                const data = await response.json();
                setBusiness(data);
                setUserPlan(data.subscriptionPlan); // הנחה שתחזור גם החבילה
                setLoading(false);
            } catch (error) {
                console.error("שגיאה בטעינת המידע של העסק", error);
                setLoading(false);
            }
        };

        fetchBusinessData();
    }, [businessId]);

    if (loading) return <p>🔄 טוען נתונים...</p>;

    const canChat = checkFeatureAvailability('צ\'אט עם לקוחות', userPlan);
    const canSchedule = checkFeatureAvailability('תיאום תורים/שירותי בית', userPlan);

    return (
        <div>
            <h1>{business.name}</h1>
            <h2>אודות העסק</h2>
            <p>{business.about}</p>

            <h2>פרטי יצירת קשר</h2>
            <p>{business.contact}</p>

            <h2>גלריה</h2>
            <div>
                {business.gallery.map((image, index) => (
                    <img key={index} src={image} alt={`Gallery ${index}`} />
                ))}
            </div>

            {canChat && <button>צ'אט עם לקוחות</button>}
            {canSchedule && <button>תיאום תור/שירותי בית</button>}
        </div>
    );
};

export default BusinessPage;
