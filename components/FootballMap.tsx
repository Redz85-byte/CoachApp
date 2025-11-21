import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

type FieldResult = {
  title: string;
  type?: string;
  latitude: number;
  longitude: number;
};

const FootballMap = () => {
  const [fields, setFields] = useState<FieldResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://serpapi.com/search.json?engine=google_maps&q=football+field+Finland&ll=@60.1699,24.9384,10z&api_key=YOUR_API_KEY`
      );
      const json = await res.json();

      console.log(json.local_results); // Tarkista data DevToolsista

      const results: FieldResult[] = (json.local_results || [])
        .filter((item: any) => item.gps_coordinates)
        .map((item: any) => ({
          title: item.title || "Unknown Field",
          type: item.type || "Football Field",
          latitude: Number(item.gps_coordinates.latitude),
          longitude: Number(item.gps_coordinates.longitude),
        }));

      setFields(results);
    } catch (error) {
      console.log("Error fetching fields", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <MapView
      style={{ flex: 1 }}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: 60.1699,  
        longitude: 24.9384,
        latitudeDelta: 0.3, 
        longitudeDelta: 0.3,
      }}
    >
      {fields.map((field, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: field.latitude, longitude: field.longitude }}
          title={field.title}
          description={field.type}
        />
      ))}
    </MapView>
  );
};

export default FootballMap;



