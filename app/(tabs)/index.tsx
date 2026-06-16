import React from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Platform, useWindowDimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { portfolioData } from '@/constants/portfolioData';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import WebHeader from '@/components/WebHeader';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { profile } = portfolioData;

  const openUrl = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: themeColors.background }]}>
      {/* Custom Sticky Header for Web */}
      <WebHeader activeTab="home" />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer, 
          { maxWidth: 1100 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        
        {/* HERO SECTION */}
        <View style={[styles.heroSection, { flexDirection: isLargeScreen ? 'row' : 'column-reverse', gap: 40 }]}>
          
          {/* Left Text details */}
          <View style={[styles.heroTextContainer, { flex: isLargeScreen ? 1.2 : undefined, alignItems: isLargeScreen ? 'flex-start' : 'center' }]}>
            <Text style={[styles.greetingText, { color: themeColors.text }]}>Hello, It's Me</Text>
            <Text style={[styles.heroName, { color: themeColors.text }]}>{profile.name}</Text>
            
            <View style={[styles.typedContainer, { justifyContent: isLargeScreen ? 'flex-start' : 'center' }]}>
              <Text style={[styles.heroSub, { color: themeColors.text }]}>And I'm a </Text>
              <Text style={[styles.heroSubHighlight, { color: themeColors.tint }]}>{profile.title}</Text>
            </View>

            <Text style={[styles.heroDescription, { color: themeColors.secondaryText, textAlign: isLargeScreen ? 'left' : 'center' }]}>
              Driven Information Technology graduate with a strong foundation in network infrastructure, device configuration, and software development. seeking to deploy high-performing IT solutions.
            </Text>

            {/* Glowing Social Circles */}
            <View style={styles.socialRow}>
              <TouchableOpacity 
                style={[styles.socialCircle, { borderColor: themeColors.tint }]}
                onPress={() => openUrl(profile.github)}
              >
                <Ionicons name="logo-github" size={20} color={themeColors.tint} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.socialCircle, { borderColor: themeColors.tint }]}
                onPress={() => openUrl(profile.linkedin)}
              >
                <Ionicons name="logo-linkedin" size={20} color={themeColors.tint} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.socialCircle, { borderColor: themeColors.tint }]}
                onPress={() => openUrl(profile.twitter)}
              >
                <Ionicons name="logo-twitter" size={20} color={themeColors.tint} />
              </TouchableOpacity>
            </View>

            {/* Neon CV / Contact CTA Button */}
            <TouchableOpacity 
              style={[styles.neonButton, { backgroundColor: themeColors.tint, shadowColor: themeColors.tint }]}
              onPress={() => router.push('/contacts')}
              activeOpacity={0.8}
            >
              <Text style={[styles.neonButtonText, { color: colorScheme === 'dark' ? '#1f242d' : '#ffffff' }]}>Hire Me</Text>
            </TouchableOpacity>
          </View>

          {/* Right Glowing Profile Photo (Hexagon on Web, Circle on Mobile) */}
          <View style={[styles.heroImageContainer, { flex: isLargeScreen ? 0.8 : undefined }]}>
            <View style={[
              styles.imageWrapper, 
              { 
                shadowColor: themeColors.tint, 
                borderColor: themeColors.tint,
                width: isLargeScreen ? 320 : 260,
                height: isLargeScreen ? 320 : 260,
                borderRadius: isLargeScreen ? 0 : 130, // Hexagon requires no border radius
              }
            ]}>
              <Image 
                source={profile.avatar}
                style={styles.profilePic}
                resizeMode="cover"
              />
            </View>
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
  heroSection: {
    backgroundColor: 'transparent',
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroName: {
    fontSize: 64,
    fontWeight: '900',
    lineHeight: 72,
    marginBottom: 10,
  },
  typedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    backgroundColor: 'transparent',
    width: '100%',
  },
  heroSub: {
    fontSize: 28,
    fontWeight: '700',
  },
  heroSubHighlight: {
    fontSize: 28,
    fontWeight: '700',
  },
  heroDescription: {
    fontSize: 18,
    lineHeight: 30,
    marginBottom: 28,
    maxWidth: 600,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: 'transparent',
    marginBottom: 32,
  },
  socialCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
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
  heroImageContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    borderWidth: 3,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 8,
    backgroundColor: 'rgba(0, 238, 255, 0.1)', // Subtle tint backing
    ...Platform.select({
      web: {
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        outline: 'none',
      } as any,
    }),
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },
});
