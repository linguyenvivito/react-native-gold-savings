import { Stack } from "expo-router";

export default function SettingLayout() {
  return (
    <Stack
      // See React Navigation documentation for more information on available screenOptions: https://reactnavigation.org/docs/headers/#sharing-common-options-across-screens
      screenOptions={{
        headerStyle: {
          backgroundColor: '#d4af37',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'Monospace',
        },
      }}>
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="anonymous" options={{ title: 'Anonymous update' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="password" options={{ title: 'Change Password' }} />
      <Stack.Screen name="privacy" options={{ title: 'Privacy' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
    </Stack>
  );
}
