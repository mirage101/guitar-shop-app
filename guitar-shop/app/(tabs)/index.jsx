import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function App() {
  return (
    <SafeAreaView className="min-h-screen">
      <View className="bg-white flex-1">
        <Text>test</Text>     
      </View>
    </SafeAreaView>
  );
}


