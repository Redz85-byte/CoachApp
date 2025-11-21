import TabBar from "@/components/TabBar";
import { Tabs } from "expo-router";
import React from "react";


const _layout = () => {
    return (
        <Tabs tabBar={(props) => <TabBar {...props} />}>
            <Tabs.Screen
                name="index"
                options={{ title: "Koti" }}
            />

            <Tabs.Screen
                name="Training"
                options={{ title: "Harjoitukset" }}
            />

            <Tabs.Screen
                name="Calender"
                options={{ title: "Kalenteri" }}
            />

            <Tabs.Screen
                name="Map"
                options={{ title: "Kartta" }}
            />
        </Tabs>
    );
};

export default _layout;

