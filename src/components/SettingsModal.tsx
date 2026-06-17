import React from 'react';
import { StyleSheet, Modal, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { Text, View } from './Themed';
import Colors from '@/constants/Colors';
import { useColorScheme, setThemeGlobal } from './useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { removeIndexedDBItem } from '@/utils/storage';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme];

  const handleResetData = () => {
    const reset = async () => {
      try {
        if (Platform.OS === 'web') {
          await removeIndexedDBItem('portfolio_projects');
          await removeIndexedDBItem('portfolio_certificates');
          localStorage.removeItem('portfolio_projects');
          localStorage.removeItem('portfolio_certificates');
          window.location.reload();
        } else {
          // Fallback or empty alert on native
          onClose();
        }
      } catch (e) {
        console.error("Failed to reset portfolio data", e);
      }
    };

    if (Platform.OS === 'web') {
      const proceed = window.confirm("Are you sure you want to reset all portfolio uploads and certificates back to default data?");
      if (proceed) reset();
    } else {
      Alert.alert(
        "Reset Data",
        "Are you sure you want to reset all data back to defaults?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Reset", style: "destructive", onPress: reset }
        ]
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <TouchableOpacity 
          style={styles.modalCloseArea} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <View style={[styles.settingsCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: themeColors.text }]}>Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color={themeColors.tint} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {/* Theme Selector */}
            <View style={styles.optionGroup}>
              <Text style={[styles.optionLabel, { color: themeColors.text }]}>Choose Theme</Text>
              <View style={styles.themeRow}>
                <TouchableOpacity 
                  className="btn-outline-3d"
                  style={[
                    styles.themeBtn, 
                    { borderColor: themeColors.border },
                    colorScheme === 'light' && { backgroundColor: themeColors.tint, borderColor: themeColors.tint }
                  ]}
                  onPress={() => setThemeGlobal('light')}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name="sunny-outline" 
                    size={18} 
                    color={colorScheme === 'light' ? '#FFFFFF' : themeColors.secondaryText} 
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[
                    styles.themeBtnText, 
                    { color: colorScheme === 'light' ? '#FFFFFF' : themeColors.text }
                  ]}>Light Mode</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="btn-3d"
                  style={[
                    styles.themeBtn, 
                    { borderColor: themeColors.border },
                    colorScheme === 'dark' && { backgroundColor: themeColors.tint, borderColor: themeColors.tint }
                  ]}
                  onPress={() => setThemeGlobal('dark')}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name="moon-outline" 
                    size={18} 
                    color={colorScheme === 'dark' ? '#1f242d' : themeColors.secondaryText} 
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[
                    styles.themeBtnText, 
                    { color: colorScheme === 'dark' ? '#1f242d' : themeColors.text }
                  ]}>Dark Mode</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Version Display */}
            <View style={styles.optionGroup}>
              <Text style={[styles.optionLabel, { color: themeColors.text }]}>Project Version</Text>
              <View style={[styles.infoBox, { backgroundColor: themeColors.background, borderColor: themeColors.border }]}>
                <Ionicons name="information-circle-outline" size={20} color={themeColors.tint} style={{ marginRight: 8 }} />
                <Text style={[styles.infoText, { color: themeColors.secondaryText }]}>Version 1.2.0 (Premium Developer Release)</Text>
              </View>
            </View>

            {/* Reset Data Option */}
            <View style={styles.optionGroup}>
              <Text style={[styles.optionLabel, { color: themeColors.text }]}>Reset Storage Data</Text>
              <TouchableOpacity 
                className="btn-outline-3d"
                style={[styles.resetBtn, { borderColor: '#EF4444' }]}
                onPress={handleResetData}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                <Text style={styles.resetBtnText}>Reset Portfolio Data</Text>
              </TouchableOpacity>
              <Text style={[styles.helpText, { color: themeColors.secondaryText }]}>
                Warning: This resets all custom project and certificate uploads back to the default original portfolio content.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  settingsCard: {
    width: '90%',
    maxWidth: 480,
    maxHeight: '80%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    zIndex: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  scroll: {
    backgroundColor: 'transparent',
  },
  optionGroup: {
    backgroundColor: 'transparent',
    marginBottom: 24,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'transparent',
  },
  themeBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  themeBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resetBtn: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  resetBtnText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
  helpText: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16,
  },
});
