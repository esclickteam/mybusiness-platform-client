```javascript
import React, { useState } from "react";
import TimePicker from "react-time-picker";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

export default function TimePickerExample() {
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');

  return (
    <div dir="rtl" style={{ maxWidth: 300, margin: "40px auto" }}>
      <label>Start Time:</label>
      <TimePicker
        onChange={setStart}
        value={start}
        disableClock={true}
        format="HH:mm"
        clearIcon={null}
        amPmAriaLabel="AM/PM"
        clockIcon={null}
        locale="he-IL"
      />
      <label style={{ marginTop: 20 }}>End Time:</label>
      <TimePicker
        onChange={setEnd}
        value={end}
        disableClock={true}
        format="HH:mm"
        clearIcon={null}
        amPmAriaLabel="AM/PM"
        clockIcon={null}
        locale="he-IL"
      />
    </div>
  );
}
```