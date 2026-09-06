import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import TimePicker from "react-time-picker";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

export default function TimePickerExample() {
  const { t, i18n } = useTranslation();
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');

  return (
    <div dir={i18n.dir()} style={{ maxWidth: 300, margin: "40px auto" }}>
      <label>{t("leftover.timePicker.start")}</label>
      <TimePicker
        onChange={setStart}
        value={start}
        disableClock={true}
        format="HH:mm"
        clearIcon={null}
        amPmAriaLabel="AM/PM"
        clockIcon={null}
        locale={i18n.language}
      />
      <label style={{ marginTop: 20 }}>{t("leftover.timePicker.end")}</label>
      <TimePicker
        onChange={setEnd}
        value={end}
        disableClock={true}
        format="HH:mm"
        clearIcon={null}
        amPmAriaLabel="AM/PM"
        clockIcon={null}
        locale={i18n.language}
      />
    </div>
  );
}
