<DashboardNav
  refs={{
    cardsRef,
    insightsRef,
    nextActionsRef,
    chartsRef,
    appointmentsRef,
    weeklySummaryRef,
  }}
/>

<div ref={cardsRef}>
  <DashboardCards stats={syncedStats} unreadCount={unreadCount} />
</div>

<div ref={insightsRef}>
  <Insights
    stats={{ ...syncedStats, upcoming_appointments: getUpcomingAppointmentsCount(appointments) }}
  />
</div>

<div ref={nextActionsRef}>
  <NextActions
    stats={{
      weekly_views_count: countItemsInLastWeek(syncedStats.views, "date"),
      weekly_appointments_count: countItemsInLastWeek(appointments),
      weekly_reviews_count: countItemsInLastWeek(syncedStats.reviews, "date"),
      weekly_messages_count: countItemsInLastWeek(syncedStats.messages, "date"),
    }}
  />
</div>

<div ref={chartsRef}>
  <BarChartComponent appointments={syncedStats.appointments} title="לקוחות שהזמינו פגישות לפי חודשים 📊" />
</div>

{/* עטיפה עם ref לפגישות */}
<div ref={appointmentsRef} className="calendar-row">
  <div className="day-agenda-box">
    <DailyAgenda
      date={selectedDate}
      appointments={appointments}
      businessName={syncedStats.businessName}
    />
  </div>
  <div className="calendar-container">
    <CalendarView
      appointments={appointments}
      onDateClick={setSelectedDate}
      selectedDate={selectedDate}
    />
  </div>
</div>

<div ref={weeklySummaryRef}>
  <WeeklySummary stats={syncedStats} />
</div>
