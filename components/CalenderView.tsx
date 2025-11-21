import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";

// 🔹 Luo treenit neljäksi kuukaudeksi eteenpäin
function generateTrainingsForNextMonths(monthsAhead = 5) {
    const trainings: Record<string, any[]> = {};
    const start = dayjs();

    for (let m = 0; m < monthsAhead; m++) {
        const month = start.add(m, "month");
        const daysInMonth = month.daysInMonth();

        for (let d = 1; d <= daysInMonth; d++) {
            const date = month.date(d);
            const weekday = date.day(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

            let training = null;

            // 🔸 Ti, To, Pe 15:30–17:15 (kaksi samaa paikkaa, yksi eri)
            if ([2, 4, 5].includes(weekday)) {
                training = {
                    name: "Lajiharjoitus",
                    time: "15:30–17:15",
                    location: weekday === 5 ? "Väinämöisen kenttä" : "Ruukinlahden kupla",
                    mapsUrl:
                        weekday === 5
                            ? "https://www.google.com/maps/search/?api=1&query=Väinämöisenkatu+4,+Helsinki"
                            : "https://www.google.com/maps/search/?api=1&query=Lauttasaarentie+51,+Helsinki"
                };
            }

            // 🔸 Keskiviikkoisin 16:00–17:00 sali
            if (weekday === 3) {
                training = {
                    name: "Saliharjoitus",
                    time: "16:00–17:00",
                    location: "Jätkäsaaren halli",
                    mapsUrl:
                        "https://www.google.com/maps/search/?api=1&query=Hyvätoivonkatu+1,+Helsinki",
                };
            }

            if (training) {
                trainings[date.format("YYYY-MM-DD")] = [training];
            }
        }
    }
    return trainings;
}

export default function TrainingCalendar() {
    const [trainings, setTrainings] = useState<Record<string, any[]>>({});
    const today = dayjs().format("YYYY-MM-DD");
    const [selectedDate, setSelectedDate] = useState<string | null>(today);
    useEffect(() => {
        setTrainings(generateTrainingsForNextMonths(5)); // 4 kk eteenpäin
    }, []);

    const markedDates = Object.keys(trainings).reduce((acc, date) => {
        acc[date] = { marked: true, dotColor: "#00adf5" };
        return acc;
    }, {} as Record<string, any>);

    const selectedTrainings = selectedDate ? trainings[selectedDate] : null;

    return (
        <ScrollView style={styles.container}>
         <Text style={styles.title}>Kalenteri</Text>

            <Calendar
                firstDay={1} // 🔹 Kalenteri alkaa maanantaista
                initialDate={today}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                    ...markedDates,
                    [today]: { marked: true, dotColor: "#00adf5" },
                    ...(selectedDate && {
                        [selectedDate]: {
                            selected: true,
                            marked: true,
                            selectedColor: "#00adf5",
                        },
                    }),
                }}
                theme={{
                    todayTextColor: "#00adf5",
                    arrowColor: "#00adf5",
                }}
            />

            {selectedTrainings ? (
                selectedTrainings.map((training, i) => (
                    <TouchableOpacity
                        key={i}
                        style={styles.card}
                        onPress={() => Linking.openURL(training.mapsUrl)}
                    >
                        <Text style={styles.eventName}>{training.name}</Text>
                        <Text>{training.time}</Text>
                        <Text>{training.location}</Text>
                        <Text style={styles.link}>Avaa Google Maps</Text>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.noEvent}>Ei harjoitusta</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    card: {
        backgroundColor: "#f2f2f2",
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    eventName: { fontWeight: "bold", fontSize: 16 },
    link: { color: "#007AFF", marginTop: 4 },
    noEvent: { textAlign: "center", marginTop: 20, color: "#666" },
});
