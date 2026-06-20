import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { portfolioData } from '@/constants/portfolioData';
import { router } from 'expo-router';
import WebHeader from '@/components/WebHeader';
import NetworkBackground from '@/components/NetworkBackground';
import Avatar3D from '@/components/Avatar3D';

export default function AboutScreen() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleScroll = () => {
        document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { profile } = portfolioData;

  // Responsive design tokens
  const sectionPaddingVertical = isLargeScreen ? 40 : 20;
  const headerSize = isLargeScreen ? 56 : 38;
  const subHeaderSize = isLargeScreen ? 26 : 20;
  const descSize = isLargeScreen ? 20 : 15;
  const descLineHeight = isLargeScreen ? 32 : 24;
  const descMarginBottom = isLargeScreen ? 28 : 16;
  const btnTextSize = isLargeScreen ? 18 : 15;
  const btnHeight = isLargeScreen ? 56 : 46;
  const btnRadius = isLargeScreen ? 28 : 23;
  const avatarSize = isLargeScreen ? 420 : 300;
  const contentPaddingVertical = isLargeScreen ? 80 : 24;
  const contentPaddingHorizontal = isLargeScreen ? 24 : 16;
  const aboutSectionGap = isLargeScreen ? 48 : 24;

  return (
    <View style={[styles.mainContainer, { backgroundColor: themeColors.background }]}>
      <NetworkBackground />

      {/* Custom Sticky Header for Web */}
      <WebHeader activeTab="about" />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer, 
          { maxWidth: 1100, flexGrow: 1, justifyContent: isLargeScreen ? 'center' : 'flex-start', paddingVertical: contentPaddingVertical, paddingHorizontal: contentPaddingHorizontal }
        ]}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={[styles.aboutSection, { flexDirection: isLargeScreen ? 'row' : 'column', gap: aboutSectionGap, paddingVertical: sectionPaddingVertical }]}>
          
          {/* Left Avatar (glowing border - Hexagon on Web, Circle on Mobile) */}
          <View style={[styles.aboutImageContainer, { flex: isLargeScreen ? 0.8 : undefined }]}>
            <Avatar3D size={avatarSize} avatarSource={profile.avatar} />
          </View>
 
          {/* Right About Text details */}
          <View style={[styles.aboutTextContainer, { flex: isLargeScreen ? 1.2 : undefined, alignItems: isLargeScreen ? 'flex-start' : 'center' }]}>
            <Text className="text-3d-hologram" style={[styles.aboutHeader, { color: themeColors.text, fontSize: headerSize }]}>
              About <Text style={{ color: themeColors.tint }}>Me</Text>
            </Text>
            <Text className="text-3d-hologram" style={[styles.aboutSubHeader, { color: themeColors.text, fontSize: subHeaderSize }]}>
              Junior IT Specialist & Developer!
            </Text>
            <Text style={[styles.aboutDescription, { color: themeColors.secondaryText, textAlign: isLargeScreen ? 'left' : 'center', fontSize: descSize, lineHeight: descLineHeight, marginBottom: descMarginBottom }]} numberOfLines={6}>
              {profile.bio}
            </Text>
            <Text style={[styles.aboutDetails, { color: themeColors.secondaryText, textAlign: isLargeScreen ? 'left' : 'center', fontSize: descSize, lineHeight: descLineHeight, marginBottom: descMarginBottom }]}>
              Equipped with Electrical Installation & Maintenance NCII credentials alongside extensive software development, cabling, OS systems installation, and database management training.
            </Text>
 
            <TouchableOpacity 
              className="btn-3d"
              style={[styles.neonButton, { backgroundColor: themeColors.tint, shadowColor: themeColors.tint, height: btnHeight, borderRadius: btnRadius }]}
              onPress={() => router.push('/services')}
              activeOpacity={0.8}
            >
              <Text style={[styles.neonButtonText, { color: colorScheme === 'dark' ? '#1f242d' : '#ffffff', fontSize: btnTextSize }]}>Read More</Text>
            </TouchableOpacity>
          </View>
 
        </View>
 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: Platform.OS === 'web' ? 80 : 24,
  },
  aboutSection: {
    backgroundColor: 'transparent',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutImageContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutTextContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  aboutHeader: {
    fontSize: 56,
    fontWeight: '900',
    marginBottom: 6,
  },
  aboutSubHeader: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },
  aboutDescription: {
    fontSize: 18,
    lineHeight: 30,
    marginBottom: 16,
  },
  aboutDetails: {
    fontSize: 18,
    lineHeight: 30,
    marginBottom: 28,
  },
  neonButton: {
    height: 52,
    paddingHorizontal: 36,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 6,
  },
  neonButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  imageWrapper: {
    borderWidth: 3,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 8,
    backgroundColor: 'rgba(0, 238, 255, 0.1)', // Subtle tint backing
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },
});
