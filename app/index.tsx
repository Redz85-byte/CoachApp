import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

//  Kausisuunnitelma
const trainingPeriods = [
  {
     title: "Jakso 1",
    weeks: [44, 45, 46, 47, 48, 49],
    plan: [
      { weeks: 2, theme: "Pelin avaaminen" },
      { weeks: 1, theme: "Tilanteenvaihto -" },
      { weeks: 1, theme: "Tilanteenvaihto +" },
      { weeks: 2, theme: "Murtautuminen" },
    ],
  },
  {
    title: "Joululoma",
    weeks: [50, 51, 52, 1],
    plan: [
      { weeks: 2, theme: "Teema päätetään myöhemmin" },
      { weeks: 2, theme: "Loma / Ei teemaa" },
    ],
  },
  {
    title: "Jakso 2",
    weeks: [2, 3, 4, 5, 6, 7],
    plan: [
      { weeks: 2, theme: "Pelin avaaminen" },
      { weeks: 2, theme: "Korkea prässi" },
      { weeks: 2, theme: "Murtautuminen" },
    ],
  },
  {
    title: "Jakso 3",
    weeks: [8, 9, 10, 11, 12, 13],
    plan: [
      { weeks: 2, theme: "Pelin avaaminen" },
      { weeks: 2, theme: "Keski matalablokki" },
      { weeks: 2, theme: "Murtautuminen" },
    ],
  },
  {
    title: "Jakso 4",
    weeks: [14, 15, 16, 17, 18, 19],
    plan: [
      { weeks: 2, theme: "Pelin avaaminen" },
      { weeks: 2, theme: "Korkea prässi" },
      { weeks: 2, theme: "Murtautuminen" },
    ],
  },
  {
    title: "Jakso 5",
    weeks: [20, 21, 22, 23, 24, 25],
    plan: [
      { weeks: 2, theme: "Pelin avaaminen" },
      { weeks: 2, theme: "Keskimatala blokki" },
      { weeks: 2, theme: "Murtautuminen" },
    ],
  },
  {
    title: "Jakso 6",
    weeks: [26, 27, 28, 29, 30, 31],
    plan: [
      { weeks: 2, theme: "Pelin avaaminen" },
      { weeks: 2, theme: "Korkea prässi" },
      { weeks: 2, theme: "Murtautuminen" },
    ],
  },
  {
    title: "Jakso 7",
    weeks: [32, 33, 34, 35, 36, 37],
    plan: [
      { weeks: 2, theme: "Pelin avaaminen" },
      { weeks: 2, theme: "Keski matalablokki" },
      { weeks: 2, theme: "Murtautuminen" },
    ],
  },
  {
    title: "Jakso 8",
    weeks: [38, 39, 40, 41, 42],
    plan: [
      { weeks: 2, theme: "Pelin avaaminen" },
      { weeks: 2, theme: "Korkea prässi" },
      { weeks: 1, theme: "Murtautuminen" },
    ],
  },
];

//  Viikkolaskuri 

function getWeekNumber() {
  const now = new Date();
  const jan4 = new Date(now.getFullYear(), 0, 4);
  const dayOfWeek = (jan4.getDay() + 6) % 7;
  const firstMonday = new Date(jan4);
  firstMonday.setDate(jan4.getDate() - dayOfWeek);
  const diffDays = Math.floor((now.getTime() - firstMonday.getTime()) / 86400000);
  return Math.floor(diffDays / 7) + 1;
}

// Luo jakson viikkoteemat

function expandWeeksForPeriod(period: any) {
  const expanded: { week: number; theme: string }[] = [];
  let weekIndex = 0;
  for (const part of period.plan) {
    for (let i = 0; i < part.weeks; i++) {
      expanded.push({
        week: period.weeks[weekIndex] ?? 0,
        theme: part.theme,
      });
      weekIndex++;
    }
  }
  return expanded;
}

const Home = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const currentWeek = getWeekNumber();

  const today = new Date().toLocaleDateString("fi-FI", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentPeriod = trainingPeriods.find((p) => p.weeks.includes(currentWeek));
  const expandedWeeks = currentPeriod ? expandWeeksForPeriod(currentPeriod) : [];
  const currentTheme =
    expandedWeeks.find((w) => w.week === currentWeek)?.theme ||
    "Ei teemaa – mahdollisesti lomaviikko";

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>CoachApp</Text>
      <Text style={styles.date}>{today}</Text>
      <Text style={styles.week}>Viikko {currentWeek}</Text>
      <Text style={styles.theme}>
        Tämän viikon teema: <Text style={styles.bold}>{currentTheme}</Text>
      </Text>

      <Text style={styles.sectionTitle}>Vuosisuunnitelma</Text>

      {trainingPeriods.map((period) => {
        const isExpanded = expanded === period.title;
        const weeks = expandWeeksForPeriod(period);

        return (
          <View key={period.title} style={styles.periodContainer}>
            <TouchableOpacity
              style={styles.periodHeader}
              onPress={() =>
                setExpanded(isExpanded ? null : period.title)
              }
            >
              <Text style={[styles.periodTitle, { textAlign: "center" }]}>
                {period.title}
              </Text>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.weeksContainer}>
                {weeks.map((week) => (
                  <View
                    key={week.week}
                    style={[
                      styles.weekItem,
                      week.week === currentWeek && styles.currentWeekItem,
                    ]}
                  >
                    <Text
                      style={[
                        styles.weekLabel,
                        week.week === currentWeek && styles.currentWeekLabel,
                      ]}
                    >
                      Viikko {week.week}
                    </Text>
                    <Text
                      style={[
                        styles.weekTheme,
                        week.week === currentWeek && styles.currentWeekTheme,
                      ]}
                    >
                      {week.theme}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}

      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: "#f9fafb",
  },
  container: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0891b2",
    marginBottom: 10,
    textAlign: "center",
  },
  date: {
    fontSize: 18,
    color: "#374151",
    marginBottom: 4,
    textAlign: "center",
  },
  week: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },
  theme: {
    fontSize: 18,
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 20,
  },
  bold: {
    fontWeight: "bold",
    color: "#0891b2",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111827",
    textAlign: "center",
  },
  periodContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  periodHeader: {
    padding: 12,
    backgroundColor: "#0891b2",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  periodTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  weeksContainer: {
    padding: 10,
  },
  weekItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  weekLabel: {
    fontSize: 16,
    color: "#111827",
  },
  weekTheme: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  currentWeekItem: {
    backgroundColor: "#0891b2",
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  currentWeekLabel: {
    color: "#fff",
  },
  currentWeekTheme: {
    color: "#fff",
    fontWeight: "bold",
  },
});
