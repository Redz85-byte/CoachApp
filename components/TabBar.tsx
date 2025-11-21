import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";
import React, { JSX } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const { colors } = useTheme()

    const primaryColor = "#0891b2";
    const greyColor = "#737373";

    const icons: Record<string, (props: { [key: string]: any }) => JSX.Element> = {
        index: (props) => <FontAwesome name="home" size={24} color={props.color ?? greyColor} {...props} />,
        Training: (props) => <Ionicons name="football" size={24} color={props.color ?? greyColor} {...props} />,
        Calender: (props) => <FontAwesome name="calendar" size={24} color={props.color ?? greyColor} {...props} />,
        Map: (props) => <Feather name="map" size={24} color={props.color ?? greyColor} {...props} />
    }

    return (
        <View style={styles.tabbar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key]
                const label =
                    options.tabBarLabel ?? options.title ?? route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    })

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                }

                const onLongPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key,
                    })
                }

                return (
                    <TouchableOpacity
                        key={route.key}
                        style={styles.tabbarItem}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                    >
                        {
                            (icons[route.name] || icons.index)({
                                color: isFocused ? primaryColor : greyColor
                            })
                        }
                        <Text style={{ color: isFocused ? primaryColor : greyColor, fontSize: 11 }}>
                            {typeof label === "function"
                                ? label({
                                    focused: isFocused,
                                    color: isFocused ? primaryColor : greyColor,
                                    position: "below-icon",
                                    children: "",
                                })
                                : label}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    tabbar: {
        position: "absolute",
        bottom: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        borderCurve: "continuous",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        shadowOpacity: 0.1
    },
    tabbarItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 4
    }
})

export default TabBar;
