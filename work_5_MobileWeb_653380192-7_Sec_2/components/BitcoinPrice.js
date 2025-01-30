import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';

export default function BTCPrice() {
  const [price, setPrice] = useState(null);
  const [prevPrice, setPrevPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBTCPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      const data = await response.json();
      const newPrice = data.bitcoin.usd;

      setPrevPrice(price); // บันทึกราคาก่อนหน้า
      setPrice(newPrice);   // ตั้งค่าราคาใหม่
      setLoading(false);
    } catch (error) {
      console.error('Error fetching BTC price:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBTCPrice(); // ดึงราคาครั้งแรกเมื่อเริ่มต้น

    const intervalId = setInterval(() => {
      fetchBTCPrice(); // รีเฟรชทุก 1 นาที
    }, 60000); // 1 นาที = 60000 มิลลิวินาที

    return () => clearInterval(intervalId); // ลบ interval เมื่อคอมโพเนนต์ถูก unmount
  }, [price]); // รีเฟรชทุกครั้งที่ราคามีการเปลี่ยนแปลง

  let priceColor = '#007AFF'; // สีเริ่มต้น
  if (prevPrice !== null) {
    priceColor = price > prevPrice ? 'green' : 'red'; // ถ้าราคาเพิ่มเป็นสีเขียว ถ้าราคาลดเป็นสีแดง
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.price, { color: priceColor }]}>${price} USD</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  price: {
    fontSize: 24,
    fontFamily: 'chakapetch',
    fontWeight: 'bold',
  },
});
