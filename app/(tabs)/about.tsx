import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { portfolioData } from '@/constants/portfolioData';
import { router } from 'expo-router';
import WebHeader from '@/components/WebHeader';

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

  return (
    <View style={[styles.mainContainer, { backgroundColor: themeColors.background }]}>
      {Platform.OS === 'web' && (
        <style>{`
          .avatar-3d {
            transition: transform 0.2s ease-out, box-shadow 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            transform-style: preserve-3d;
            perspective: 1000px;
            transform: translateY(calc(var(--scroll-y) * -0.08px)) 
                       rotateY(calc(var(--scroll-y) * -0.02deg)) 
                       rotateX(calc(var(--scroll-y) * -0.015deg));
          }
          .avatar-3d:hover {
            transform: scale(1.08) rotateY(-15deg) rotateX(10deg) translateY(-4px) !important;
            box-shadow: 0 25px 50px ${themeColors.tint}80 !important;
            border-color: ${themeColors.tint} !important;
          }
        `}</style>
      )}

      {/* Custom Sticky Header for Web */}
      <WebHeader activeTab="about" />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer, 
          { maxWidth: 1100, flexGrow: 1, justifyContent: isLargeScreen ? 'center' : 'flex-start' }
        ]}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={[styles.aboutSection, { flexDirection: isLargeScreen ? 'row' : 'column', gap: 40 }]}>
          
          {/* Left Avatar (glowing border - Hexagon on Web, Circle on Mobile) */}
          <View style={[styles.aboutImageContainer, { flex: isLargeScreen ? 0.8 : undefined }]}>
            {Platform.OS === 'web' ? (
              <View 
                className="avatar-3d"
                style={{
                  width: isLargeScreen ? 320 : 260,
                  height: isLargeScreen ? 320 : 260,
                  filter: `drop-shadow(0 0 20px ${themeColors.tint}60)`,
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                } as any}
              >
                <View 
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: themeColors.tint,
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  } as any}
                >
                  <View 
                    style={{
                      width: '98%',
                      height: '98%',
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                      backgroundColor: themeColors.background,
                      overflow: 'hidden',
                    } as any}
                  >
                    <Image 
                      source={profile.avatar}
                      style={styles.profilePic}
                      resizeMode="cover"
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View 
                style={[
                  styles.imageWrapper, 
                  { 
                    shadowColor: themeColors.tint, 
                    borderColor: themeColors.tint,
                    width: 260,
                    height: 260,
                    borderRadius: 130,
                  }
                ]}
              >
                <Image 
                  source={profile.avatar}
                  style={styles.profilePic}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>

          {/* Right About Text details */}
          <View style={[styles.aboutTextContainer, { flex: isLargeScreen ? 1.2 : undefined, alignItems: isLargeScreen ? 'flex-start' : 'center' }]}>
            <Text className="text-3d-hologram" style={[styles.aboutHeader, { color: themeColors.text }]}>
              About <Text style={{ color: themeColors.tint }}>Me</Text>
            </Text>
            <Text className="text-3d-hologram" style={[styles.aboutSubHeader, { color: themeColors.text }]}>
              Junior IT Specialist & Developer!
            </Text>
            <Text style={[styles.aboutDescription, { color: themeColors.secondaryText, textAlign: isLargeScreen ? 'left' : 'center' }]}>
              {profile.bio}
            </Text>
            <Text style={[styles.aboutDetails, { color: themeColors.secondaryText, textAlign: isLargeScreen ? 'left' : 'center' }]}>
              Equipped with Electrical Installation & Maintenance NCII credentials alongside extensive software development, cabling, OS systems installation, and database management training.
            </Text>

            <TouchableOpacity 
              className="btn-3d"
              style={[styles.neonButton, { backgroundColor: themeColors.tint, shadowColor: themeColors.tint }]}
              onPress={() => router.push('/services')}
              activeOpacity={0.8}
            >
              <Text style={[styles.neonButtonText, { color: colorScheme === 'dark' ? '#1f242d' : '#ffffff' }]}>Read More</Text>
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
