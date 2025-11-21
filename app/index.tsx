import { useAuth } from '@/src/hooks/useAuth';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
        <ActivityIndicator size="large" color="#ff7a5e" />
      </View>
    );
  }

  if (!user) {
    console.log('Index: No user, redirecting to login');
    return <Redirect href="/login" />;
  }

  console.log('Index: User found:', user.email, 'Role:', user.role);

  if (user.role === 'admin') {
    console.log('Index: Redirecting to Admin Dashboard');
    return <Redirect href="/(admin)/dashboard" />;
  }

  console.log('Index: Redirecting to User Tabs');
  return <Redirect href="/(tabs)" />;
}
