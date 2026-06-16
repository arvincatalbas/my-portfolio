import React from 'react';
import { StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Text, View } from './Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface WebHeaderProps {
  activeTab: 'home' | 'about' | 'services' | 'portfolio' | 'contacts';
}

export default function WebHeader({ activeTab }: WebHeaderProps) {
  const { width } = useWindowDimensions();
  const isMobileWeb = width <= 768;
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  if (Platform.OS !== 'web') {
    return null;
  }

  const handleNav = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
      <View style={[styles.headerContent, { maxWidth: 1024 }]}>
        {/* Logo */}
        <TouchableOpacity onPress={() => handleNav('/')} activeOpacity={0.8} style={styles.logoBtn}>
          <Text style={[styles.logoText, { color: themeColors.text }]}>
            Portfolio<Text style={{ color: themeColors.tint }}>.</Text>
          </Text>
        </TouchableOpacity>

        {/* Desktop Links */}
        {!isMobileWeb && (
          <View style={styles.navLinks}>
            <TouchableOpacity onPress={() => handleNav('/')} style={styles.linkItem}>
              <Text 
                style={[
                  styles.linkText, 
                  { color: activeTab === 'home' ? themeColors.tint : themeColors.text }
                ]}
              >
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleNav('/about')} style={styles.linkItem}>
              <Text 
                style={[
                  styles.linkText, 
                  { color: activeTab === 'about' ? themeColors.tint : themeColors.text }
                ]}
              >
                About
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleNav('/services')} style={styles.linkItem}>
              <Text 
                style={[
                  styles.linkText, 
                  { color: activeTab === 'services' ? themeColors.tint : themeColors.text }
                ]}
              >
                Services
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleNav('/portfolio')} style={styles.linkItem}>
              <Text 
                style={[
                  styles.linkText, 
                  { color: activeTab === 'portfolio' ? themeColors.tint : themeColors.text }
                ]}
              >
                Portfolio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleNav('/contacts')} style={styles.linkItem}>
              <Text 
                style={[
                  styles.linkText, 
                  { color: activeTab === 'contacts' ? themeColors.tint : themeColors.text }
                ]}
              >
                Contact
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Mobile Web Indicator */}
        {isMobileWeb && (
          <View style={styles.mobileIndicator}>
            <Ionicons name="desktop-outline" size={16} color={themeColors.secondaryText} />
            <Text style={[styles.mobileIndicatorText, { color: themeColors.secondaryText }]}>Web Version</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 72,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 100,
  },
  headerContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  logoBtn: {
    backgroundColor: 'transparent',
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  linkItem: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
  },
  linkText: {
    fontSize: 17,
    fontWeight: '600',
  },
  mobileIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'transparent',
  },
  mobileIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
