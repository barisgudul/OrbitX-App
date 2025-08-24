// components/AddTransactionModal.tsx

import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, FontSize } from '../constants/Theme';
import { usePortfolioStore } from '../store/portfolioStore';
import { FinancialAsset } from '../types';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  assets: FinancialAsset[]; // Kullanıcının seçebileceği tüm varlıkların listesi
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ visible, onClose, assets }) => {
  const { addTransaction } = usePortfolioStore();
  
  const [selectedAssetId, setSelectedAssetId] = useState<string | undefined>(assets[0]?.id);
  const [amount, setAmount] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');

  const handleAddTransaction = () => {
    if (!selectedAssetId || !amount || !pricePerUnit) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    addTransaction({
      assetId: selectedAssetId,
      amount: parseFloat(amount),
      pricePerUnit: parseFloat(pricePerUnit),
      type: 'buy', // Şimdilik sadece alım işlemi
      date: new Date().toISOString(),
    });
    onClose(); // İşlem eklenince modal'ı kapat
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Yeni İşlem Ekle</Text>

          <Text style={styles.label}>Varlık</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedAssetId}
              onValueChange={(itemValue) => setSelectedAssetId(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {assets.map(asset => (
                <Picker.Item key={asset.id} label={`${asset.name} (${asset.symbol})`} value={asset.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Miktar</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: 0.5"
            placeholderTextColor={Colors.textSecondary} // <-- BU SATIRI EKLE
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.label}>Alış Fiyatı (Birim Başına)</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: 48500.50"
            placeholderTextColor={Colors.textSecondary} // <-- BU SATIRI EKLE
            keyboardType="numeric"
            value={pricePerUnit}
            onChangeText={setPricePerUnit}
          />

          {/* Standart butonu custom TouchableOpacity ile değiştiriyoruz */}
          <TouchableOpacity style={styles.saveButton} onPress={handleAddTransaction}>
            <Text style={styles.saveButtonText}>İşlemi Kaydet</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
         </View>
       </View>
     </Modal>
   );
 };

 const styles = StyleSheet.create({
    modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
    modalContent: { 
      backgroundColor: '#161b22', // Arka planı biraz daha farklı yapalım
      padding: 20, 
      paddingBottom: 40, // Altta boşluk
      borderTopLeftRadius: 20, 
      borderTopRightRadius: 20, 
    },
    title: { color: Colors.textPrimary, fontSize: FontSize.title, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { color: Colors.textSecondary, marginBottom: 8, marginTop: 16, fontSize: 14 },
    input: { 
      backgroundColor: Colors.background, // Input arka planı
      color: Colors.textPrimary, 
      padding: 16, // Daha ferah
      borderRadius: 8, 
      fontSize: FontSize.body,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    pickerContainer: { 
      backgroundColor: Colors.background, // Picker arka planı
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.border,
      justifyContent: 'center', // iOS'te ortalamak için
    },
    picker: { 
      color: Colors.textPrimary,
      height: Platform.OS === 'ios' ? 180 : 50, // iOS için yüksekliği artır
    },
    pickerItem: { 
      color: Colors.textPrimary, 
      fontSize: 18,
    },
    // Butonları daha şık yapalım
    saveButton: {
      backgroundColor: Colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 24,
    },
    saveButtonText: {
      color: Colors.textPrimary,
      fontSize: FontSize.body,
      fontWeight: 'bold',
    },
    closeButton: { 
      marginTop: 16, 
      alignItems: 'center' 
    },
    closeButtonText: { 
      color: Colors.textSecondary, // Rengi daha sönük yapalım
      fontSize: FontSize.body 
    },
 });