import * as React from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Button, ImageBackground } from 'react-native';
import Constants from 'expo-constants';
import { Card } from 'react-native-paper';
import * as Font from 'expo-font';

// Import Components
import BTCPrice from './components/BitcoinPrice';

export default function App() {
  const [price, setPrice] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [countdown, setCountdown] = React.useState(60); // เริ่มต้นจาก 60 วินาที
  const [fontsLoaded] = Font.useFonts({
    chakapetch: require('./assets/ChakraPetch-Regular.ttf'),
  });

  const fetchBTCPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      const data = await response.json();
      setPrice(data.bitcoin.usd);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching BTC price:', error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBTCPrice(); // ดึงราคาครั้งแรกเมื่อเริ่มต้น

    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          fetchBTCPrice(); // รีเฟรชข้อมูล
          return 60; // รีเซ็ตนับถอยหลังเป็น 60 วินาที
        }
        return prevCountdown - 1; // นับถอยหลังทุกวินาที
      });
    }, 1000); // อัพเดททุกๆ 1 วินาที

    return () => clearInterval(intervalId); // ลบ interval เมื่อคอมโพเนนต์ถูก unmount
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchBTCPrice();
    setCountdown(60); // รีเซ็ตเวลาเมื่อกดปุ่ม Refresh
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Fonts...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('./assets/web.jpg')} style={styles.container}>
      <Text style={styles.header}>Bitcoin Price Tracker</Text>
      <Card style={styles.card} elevation={5}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <BTCPrice price={price} />
        )}
      </Card>
      
      <Text style={styles.countdown}>Next update in: {countdown}s</Text>
      
      <Text style={styles.footer}>Developed by Jetsadakorn Dutphayap</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'chakapetch',
    color: '#000',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  footer: {
    marginTop: 30,
    fontSize: 16,
    color: '#000',
    fontFamily: 'chakapetch',
  },
  countdown: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: 'chakapetch',
    color: '#007AFF',
  },
});
