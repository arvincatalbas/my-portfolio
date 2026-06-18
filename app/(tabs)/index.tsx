import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Platform, useWindowDimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { portfolioData } from '@/constants/portfolioData';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import WebHeader from '@/components/WebHeader';
import SettingsModal from '@/components/SettingsModal';
import { getIndexedDBItem } from '@/utils/storage';
import * as WebBrowser from 'expo-web-browser';

export default function HomeScreen() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
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

  const [resumeUrl, setResumeUrl] = useState<string>(profile.resumeUrl);
  const navigation = useNavigation();

  useEffect(() => {
    const loadResume = async () => {
      if (Platform.OS === 'web') {
        try {
          const storedResume = await getIndexedDBItem<string>('portfolio_resume');
          if (storedResume) {
            setResumeUrl(storedResume);
          }
        } catch (e) {
          console.error("Failed to load resume from storage", e);
        }
      }
    };

    loadResume();

    const unsubscribe = navigation.addListener('focus', () => {
      loadResume();
    });

    return unsubscribe;
  }, [navigation]);

  // Responsive design tokens
  const greetingSize = isLargeScreen ? 34 : 26;
  const nameSize = isLargeScreen ? 72 : 46;
  const nameLineHeight = isLargeScreen ? 82 : 52;
  const titleSize = isLargeScreen ? 32 : 22;
  const titleLineHeight = isLargeScreen ? 40 : 28;
  const descSize = isLargeScreen ? 20 : 15;
  const descLineHeight = isLargeScreen ? 32 : 24;
  const descMarginBottom = isLargeScreen ? 36 : 20;
  const socialIconSize = isLargeScreen ? 22 : 18;
  const socialCircleSize = isLargeScreen ? 48 : 38;
  const socialCircleRadius = isLargeScreen ? 24 : 19;
  const ctaBtnTextSize = isLargeScreen ? 18 : 15;
  const ctaBtnHeight = isLargeScreen ? 56 : 46;
  const ctaBtnRadius = isLargeScreen ? 28 : 23;
  const contentPaddingVertical = isLargeScreen ? 80 : 24;
  const contentPaddingHorizontal = isLargeScreen ? 24 : 16;
  const heroSectionGap = isLargeScreen ? 48 : 24;
  const heroPaddingVertical = isLargeScreen ? 40 : 20;
  const profilePicSize = isLargeScreen ? 420 : 300;

  const openUrl = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  const handleOpenResume = async () => {
    if (Platform.OS === 'web' && resumeUrl.startsWith('data:application/pdf;base64,')) {
      try {
        const base64Data = resumeUrl.split(',')[1];
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        return;
      } catch (e) {
        console.error("Failed to open local base64 PDF", e);
      }
    }

    try {
      await WebBrowser.openBrowserAsync(resumeUrl);
    } catch (error) {
      console.log('Error opening browser:', error);
      openUrl(resumeUrl);
    }
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: themeColors.background }]}>
      {/* 3D Animations & global inputs style reset for Web */}
      {Platform.OS === 'web' && (
        <style>{`
          .glitch-container {
            display: inline-block;
            position: relative;
            background: transparent;
            user-select: none;
          }
          
          /* glitch name styling */
          .glitch-name {
            position: relative;
            display: inline-block;
            color: ${themeColors.text};
            font-family: 'Outfit', sans-serif !important;
            font-size: ${nameSize}px;
            font-weight: 900;
            line-height: ${nameLineHeight}px;
            margin-bottom: 10px;
            animation: glitch-skew 1s infinite linear alternate-reverse;
          }
          
          .glitch-name::before,
          .glitch-name::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
          }
          
          .glitch-name::before {
            left: 2px;
            text-shadow: -2px 0 #ff0055;
            clip-path: inset(0 0 0 0);
            animation: glitch-anim-1 2s infinite linear alternate-reverse;
          }
          
          .glitch-name::after {
            left: -2px;
            text-shadow: -2px 0 #00eeff, 2px 2px 3px rgba(0, 0, 0, 0.3);
            clip-path: inset(0 0 0 0);
            animation: glitch-anim-2 2s infinite linear alternate-reverse;
          }
          
          /* glitch title styling */
          .glitch-title {
            position: relative;
            display: inline-block;
            color: ${themeColors.tint};
            font-family: 'Outfit', sans-serif !important;
            font-size: ${titleSize}px;
            font-weight: 800;
            line-height: ${titleLineHeight}px;
            animation: glitch-skew 1.5s infinite linear alternate-reverse;
          }
          
          .glitch-title::before,
          .glitch-title::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
          }
          
          .glitch-title::before {
            left: 1.5px;
            text-shadow: -1.5px 0 #ff0055;
            clip-path: inset(0 0 0 0);
            animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
          }
          
          .glitch-title::after {
            left: -1.5px;
            text-shadow: -1.5px 0 #00eeff, 1.5px 1.5px 2px rgba(0, 0, 0, 0.3);
            clip-path: inset(0 0 0 0);
            animation: glitch-anim-2 2.5s infinite linear alternate-reverse;
          }
          
          /* hover effects - speed up animations for active interaction */
          .glitch-name:hover::before,
          .glitch-title:hover::before {
            animation: glitch-anim-1 0.4s infinite linear alternate-reverse;
          }
          
          .glitch-name:hover::after,
          .glitch-title:hover::after {
            animation: glitch-anim-2 0.4s infinite linear alternate-reverse;
          }

          @keyframes glitch-anim-1 {
            0% { clip-path: inset(20% 0 80% 0); }
            10% { clip-path: inset(60% 0 30% 0); }
            20% { clip-path: inset(10% 0 85% 0); }
            30% { clip-path: inset(80% 0 5% 0); }
            40% { clip-path: inset(40% 0 55% 0); }
            50% { clip-path: inset(70% 0 20% 0); }
            60% { clip-path: inset(15% 0 80% 0); }
            70% { clip-path: inset(90% 0 2% 0); }
            80% { clip-path: inset(30% 0 60% 0); }
            90% { clip-path: inset(50% 0 45% 0); }
            100% { clip-path: inset(25% 0 70% 0); }
          }
          
          @keyframes glitch-anim-2 {
            0% { clip-path: inset(85% 0 10% 0); }
            10% { clip-path: inset(15% 0 70% 0); }
            20% { clip-path: inset(70% 0 20% 0); }
            30% { clip-path: inset(30% 0 60% 0); }
            40% { clip-path: inset(90% 0 2% 0); }
            50% { clip-path: inset(10% 0 85% 0); }
            60% { clip-path: inset(60% 0 30% 0); }
            70% { clip-path: inset(45% 0 50% 0); }
            80% { clip-path: inset(80% 0 5% 0); }
            90% { clip-path: inset(20% 0 75% 0); }
            100% { clip-path: inset(55% 0 40% 0); }
          }
          
          @keyframes glitch-skew {
            0% { transform: skew(0deg); }
            20% { transform: skew(-1deg); }
            40% { transform: skew(0.5deg); }
            60% { transform: skew(-0.5deg); }
            80% { transform: skew(1deg); }
            100% { transform: skew(0deg); }
          }
          
          @media (max-width: 768px) {
            .glitch-name {
              font-size: ${nameSize}px !important;
              line-height: ${nameLineHeight}px !important;
              text-align: center;
              margin-bottom: 12px;
            }
            .glitch-title {
              font-size: ${titleSize}px !important;
              line-height: ${titleLineHeight}px !important;
              text-align: center;
            }
          }
          /* Remove default inputs outline warning fix globally */
          input, textarea, select {
            outline: none !important;
            outline-style: none !important;
            box-shadow: none !important;
          }
          input:focus, textarea:focus, select:focus {
            outline: none !important;
            outline-style: none !important;
            box-shadow: 0 0 0 2px ${themeColors.tint} !important;
          }
          
          /* Avatar 3D Animation & Hover effect */
          .avatar-3d {
            transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            transform-style: preserve-3d;
            perspective: 1000px;
            transform: translateY(calc(var(--scroll-y) * -0.08px)) 
                       rotateY(calc(var(--scroll-y) * 0.02deg)) 
                       rotateX(calc(var(--scroll-y) * -0.015deg));
          }
          .avatar-border-3d {
            transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            transform-style: preserve-3d;
          }
          .avatar-img-3d {
            transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          }
          .avatar-3d:hover {
            transform: scale(1.12) rotateY(25deg) rotateX(15deg) translateY(-8px) !important;
            box-shadow: -15px 30px 60px ${themeColors.tint}60 !important;
            border-color: ${themeColors.tint} !important;
          }
          .avatar-3d:hover .avatar-border-3d {
            transform: translateZ(30px);
          }
          .avatar-3d:hover .avatar-img-3d {
            transform: translateZ(60px) scale(1.08);
          }
          
          /* Social circle 3D hover */
          .social-circle-3d {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          }
          .social-circle-3d:hover {
            transform: scale(1.18) translateY(-4px);
            box-shadow: 0 0 15px rgba(0, 238, 255, 0.6) !important;
            background-color: rgba(0, 238, 255, 0.1) !important;
          }
          
          /* Button 3D hover */
          .btn-3d {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          }
          .btn-3d:hover {
            transform: scale(1.06) translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 238, 255, 0.45) !important;
          }
        `}</style>
      )}

      {/* Custom Sticky Header for Web */}
      <WebHeader activeTab="home" />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer, 
          { maxWidth: 1100, flexGrow: 1, justifyContent: isLargeScreen ? 'center' : 'flex-start', paddingVertical: contentPaddingVertical, paddingHorizontal: contentPaddingHorizontal }
        ]}
        showsVerticalScrollIndicator={false}
      >
        
        {/* HERO SECTION */}
        <View style={[styles.heroSection, { flexDirection: isLargeScreen ? 'row' : 'column-reverse', gap: heroSectionGap, paddingVertical: heroPaddingVertical }]}>
          
          {/* Left Text details */}
          <View style={[styles.heroTextContainer, { flex: isLargeScreen ? 1.2 : undefined, alignItems: isLargeScreen ? 'flex-start' : 'center' }]}>
            <Text className="text-3d-hologram" style={[styles.greetingText, { color: themeColors.text, fontSize: greetingSize }]}>Hello, It's Me</Text>
            
            {/* Glitch Animated Name */}
            {Platform.OS === 'web' ? (
              <span 
                className="glitch-name"
                data-text={profile.name}
                style={{ color: themeColors.text }}
              >
                {profile.name}
              </span>
            ) : (
              <Text style={[styles.heroName, { color: themeColors.text, fontSize: nameSize, lineHeight: nameLineHeight }]}>
                {profile.name}
              </Text>
            )}
            
            <View style={[styles.typedContainer, { justifyContent: isLargeScreen ? 'flex-start' : 'center' }]}>
              <Text className="text-3d-hologram" style={[styles.heroSub, { color: themeColors.text, fontSize: titleSize }]}>And I'm a </Text>
              
              {/* Glitch Animated Title */}
              {Platform.OS === 'web' ? (
                <span 
                  className="glitch-title"
                  data-text="Network/IT Support Associate & Web Developer"
                  style={{ color: themeColors.tint }}
                >
                  Network/IT Product Associate & Web Developer
                </span>
              ) : (
                <Text style={[styles.heroSubHighlight, { color: themeColors.tint, fontSize: titleSize }]}>
                  Network/IT product Associate & Web Developer
                </Text>
              )}
            </View>
 
            <Text style={[styles.heroDescription, { color: themeColors.secondaryText, textAlign: isLargeScreen ? 'left' : 'center', fontSize: descSize, lineHeight: descLineHeight, marginBottom: descMarginBottom }]}>
              Driven Information Technology graduate with a strong foundation in network infrastructure, device configuration, and software development. seeking to deploy high-performing IT solutions.
            </Text>
 
            {/* Glowing Social Circles */}
            <View style={styles.socialRow}>
              {profile.facebook && (
                <TouchableOpacity 
                  className="social-circle-3d btn-outline-3d"
                  style={[styles.socialCircle, { borderColor: themeColors.tint, width: socialCircleSize, height: socialCircleSize, borderRadius: socialCircleRadius }]}
                  onPress={() => openUrl(profile.facebook!)}
                >
                  <Ionicons className="icon-3d-rotate" name="logo-facebook" size={socialIconSize} color={themeColors.tint} />
                </TouchableOpacity>
              )}
              {profile.instagram && (
                <TouchableOpacity 
                  className="social-circle-3d btn-outline-3d"
                  style={[styles.socialCircle, { borderColor: themeColors.tint, width: socialCircleSize, height: socialCircleSize, borderRadius: socialCircleRadius }]}
                  onPress={() => openUrl(profile.instagram!)}
                >
                  <Ionicons className="icon-3d-rotate" name="logo-instagram" size={socialIconSize} color={themeColors.tint} />
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                className="social-circle-3d btn-outline-3d"
                style={[styles.socialCircle, { borderColor: themeColors.tint, width: socialCircleSize, height: socialCircleSize, borderRadius: socialCircleRadius }]}
                onPress={() => openUrl(profile.github)}
              >
                <Ionicons className="icon-3d-rotate" name="logo-github" size={socialIconSize} color={themeColors.tint} />
              </TouchableOpacity>
              <TouchableOpacity 
                className="social-circle-3d btn-outline-3d"
                style={[styles.socialCircle, { borderColor: themeColors.tint, width: socialCircleSize, height: socialCircleSize, borderRadius: socialCircleRadius }]}
                onPress={() => openUrl(profile.linkedin)}
              >
                <Ionicons className="icon-3d-rotate" name="logo-linkedin" size={socialIconSize} color={themeColors.tint} />
              </TouchableOpacity>
              <TouchableOpacity 
                className="social-circle-3d btn-outline-3d"
                style={[styles.socialCircle, { borderColor: themeColors.tint, width: socialCircleSize, height: socialCircleSize, borderRadius: socialCircleRadius }]}
                onPress={() => openUrl(profile.twitter)}
              >
                <Ionicons className="icon-3d-rotate" name="logo-twitter" size={socialIconSize} color={themeColors.tint} />
              </TouchableOpacity>
            </View>
 
            {/* CTA Buttons Row */}
            <View style={styles.ctaRow}>
              <TouchableOpacity 
                className="btn-3d"
                style={[styles.neonButton, { backgroundColor: themeColors.tint, shadowColor: themeColors.tint, height: ctaBtnHeight, borderRadius: ctaBtnRadius }]}
                onPress={() => router.push('/contacts')}
                activeOpacity={0.8}
              >
                <Text style={[styles.neonButtonText, { color: colorScheme === 'dark' ? '#1f242d' : '#ffffff', fontSize: ctaBtnTextSize }]}>Hire Me</Text>
              </TouchableOpacity>
 
              <TouchableOpacity 
                className="btn-outline-3d"
                style={[styles.resumeButton, { borderColor: themeColors.tint, height: ctaBtnHeight, borderRadius: ctaBtnRadius }]}
                onPress={handleOpenResume}
                activeOpacity={0.8}
              >
                <Text style={[styles.resumeButtonText, { color: themeColors.tint, fontSize: ctaBtnTextSize }]}>My Resume</Text>
              </TouchableOpacity>
            </View>
          </View>
 
          {/* Right Glowing Profile Photo (Hexagon on Web, Circle on Mobile) */}
          <View style={[styles.heroImageContainer, { flex: isLargeScreen ? 0.8 : undefined }]}>
            {Platform.OS === 'web' ? (
              <View 
                className="avatar-3d"
                style={{
                  width: profilePicSize,
                  height: profilePicSize,
                  filter: `drop-shadow(0 0 20px ${themeColors.tint}60)`,
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                } as any}
              >
                <View 
                  className="avatar-border-3d"
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
                      className="avatar-img-3d"
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
                    width: profilePicSize,
                    height: profilePicSize,
                    borderRadius: profilePicSize / 2,
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
        </View>

      </ScrollView>

      {Platform.OS !== 'web' && (
        <TouchableOpacity 
          style={styles.mobileSettingsBtn}
          onPress={() => setIsSettingsOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="settings-outline" size={24} color={themeColors.text} />
        </TouchableOpacity>
      )}

      <SettingsModal visible={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
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
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 10,
    marginBottom: 20,
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
  resumeButton: {
    height: 52,
    paddingHorizontal: 36,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  resumeButtonText: {
    fontSize: 18,
    fontWeight: '700',
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
    backgroundColor: 'rgba(0, 238, 255, 0.1)',
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },
  mobileSettingsBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    zIndex: 100,
  },
});
