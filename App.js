import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Eula from "./Pagines/Inici/Eula";
import Login from "./Pagines/Inici/Login";
import SignUp from "./Pagines/Inici/SignUp";
import Home from "./Pagines/Inici/Home";
import Swipes from "./Pagines/Swipes/Swipes";
import Matches from "./Pagines/Messages/Matches";
import Chat from "./Pagines/Messages/Chat";
import Edit from "./Pagines/Editar/Edit";
import UnavailabilityList from "./Pagines/Editar/UnavailabilityList";
import DriverUnavailability from "./Pagines/Editar/DriverUnavailability";
import Account from "./Pagines/Perfil/Account";
import ManageVehicle from "./Pagines/Perfil/ManageVehicle";
import Search from "./Pagines/Cerca/Search";
import EditSchedule from "./Pagines/Editar/EditSchedule";
import ManageRoutes from "./Pagines/Editar/ManageRoutes";
import SavedRoutes from "./Pagines/Editar/SavedRoutes";
import Help from "./Pagines/Perfil/Help";
import Settings from "./Pagines/Perfil/Settings";

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Eula"
          component={Eula}
          options={{ animation: "none" }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ animation: "none" }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ animation: "none" }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ animation: "none" }}
        />
        <Stack.Screen
          name="Swipes"
          component={Swipes}
          options={{ animation: "none" }}
        />
        <Stack.Screen
          name="Matches"
          component={Matches}
          options={{ animation: "none" }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ animation: "none" }}
        />
        <Stack.Screen
          name="Edit"
          component={Edit}
          options={{ animation: "none" }}
        />
        <Stack.Screen
          name="EditSchedule"
          component={EditSchedule}
          options={{ animation: "none" }}
        />
        <Stack.Screen
          name="ManageRoutes"
          component={ManageRoutes}
          options={{ animation: "none" }}
        />
        <Stack.Screen
          name="SavedRoutes"
          component={SavedRoutes}
          options={{ animation: "none" }}
        />
        <Stack.Screen
          name="UnavailabilityList"
          component={UnavailabilityList}
          options={{ animation: "none" }}
        />
        <Stack.Screen
          name="DriverUnavailability"
          component={DriverUnavailability}
          options={{ animation: "none" }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{
            animation: "none",
          }}
        />
        <Stack.Screen
          name="ManageVehicle"
          component={ManageVehicle}
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="Help"
          component={Help}
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
