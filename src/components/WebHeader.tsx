import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Text, View } from './Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SettingsModal from './SettingsModal';

interface WebHeaderProps {
  activeTab: 'home' | 'about' | 'services' | 'portfolio' | 'contacts';
}

export default function WebHeader({ activeTab }: WebHeaderProps) {
  const { width } = useWindowDimensions();
  const isMobileWeb = width <= 768;
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (Platform.OS !== 'web') {
    return null;
  }

  const handleNav = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: themeColors.background, borderBottomColor: 'transparent' }]}>
      {/* Centralized Global 3D Animation styles */}
      {Platform.OS === 'web' && (
        <style>{`
          /* 3D Button Hover Animations */
          .btn-3d {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden !important;
          }
          .btn-3d::after {
            content: '';
            position: absolute;
            top: 0;
            left: -50%;
            width: 25%;
            height: 100%;
            background: linear-gradient(
              to right,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.35) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            transform: skewX(-25deg);
            transition: 0.75s;
            opacity: 0;
            pointer-events: none;
          }
          .btn-3d:hover {
            transform: scale(1.05) translateY(-3px) rotateX(4deg) !important;
            box-shadow: 0 12px 25px ${themeColors.tint}66 !important;
            filter: drop-shadow(0 6px 12px ${themeColors.tint}44) !important;
            cursor: pointer;
          }
          .btn-3d:hover::after {
            left: 125%;
            opacity: 1;
          }
          
          /* Secondary/Outline Button 3D lift */
          .btn-outline-3d {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .btn-outline-3d:hover {
            transform: scale(1.05) translateY(-3px) !important;
            box-shadow: 0 8px 20px ${themeColors.tint}22, 0 0 10px ${themeColors.tint}22 !important;
            border-color: ${themeColors.tint} !important;
            background-color: ${themeColors.tint}18 !important; /* ~10% opacity */
            cursor: pointer;
          }

          /* Small circular overlay buttons hover */
          .delete-overlay-btn {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          }
          .delete-overlay-btn:hover {
            transform: scale(1.18) !important;
            background-color: #EF4444 !important;
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.6) !important;
            cursor: pointer;
          }
          .delete-overlay-btn:hover .icon-3d-rotate {
            color: #FFFFFF !important;
            transform: scale(1.1) rotate(15deg) !important;
          }

          .edit-overlay-btn {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          }
          .edit-overlay-btn:hover {
            transform: scale(1.18) !important;
            background-color: ${themeColors.tint} !important;
            box-shadow: 0 0 15px ${themeColors.tint}88 !important;
            cursor: pointer;
          }
          .edit-overlay-btn:hover .icon-3d-rotate {
            color: ${colorScheme === 'dark' ? '#1f242d' : '#FFFFFF'} !important;
            transform: scale(1.1) rotate(-15deg) !important;
          }

          /* Social circle 3D hover */
          .social-circle-3d {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .social-circle-3d:hover {
            transform: scale(1.18) translateY(-4px) !important;
            box-shadow: 0 0 20px ${themeColors.tint}aa !important;
            background-color: ${themeColors.tint}22 !important;
            border-color: ${themeColors.tint} !important;
            cursor: pointer;
          }
          .social-circle-3d:hover .icon-3d-rotate {
            transform: scale(1.22) rotate(12deg) !important;
            color: ${themeColors.tint} !important;
          }
 
          /* 3D Nav Links Hover */
          .nav-link-3d {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            position: relative;
          }
          .nav-link-3d:hover {
            transform: translateY(-2px) scale(1.06) !important;
            text-shadow: 0 2px 5px ${themeColors.tint}66;
            cursor: pointer;
          }
          .nav-link-3d::after {
            content: '';
            position: absolute;
            width: 0%;
            height: 2.5px;
            bottom: -2px;
            left: 0;
            background-color: ${themeColors.tint};
            transition: width 0.3s ease;
          }
          .nav-link-3d:hover::after {
            width: 100%;
          }
 
          /* 3D Icon Animations */
          .icon-3d-rotate {
            transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          }
          .icon-3d-rotate:hover {
            transform: scale(1.22) rotate(15deg) translateZ(10px) !important;
            filter: drop-shadow(0 0 5px ${themeColors.tint}) !important;
          }
 
          .icon-3d-float {
            animation: iconFloat 3.5s ease-in-out infinite alternate;
            transition: transform 0.3s ease;
          }
          .icon-3d-float:hover {
            transform: scale(1.15) translateZ(20px);
            filter: drop-shadow(0 0 8px ${themeColors.tint});
          }
          @keyframes iconFloat {
            0% { transform: translateY(0px) rotate(0deg); }
            100% { transform: translateY(-6px) rotate(5deg); }
          }
 
          /* 3D Texts and Title Holograms */
          .text-3d-hologram {
            transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            display: inline-block;
          }
          .text-3d-hologram:hover {
            transform: translateY(-4px) scale(1.03) rotateX(10deg) !important;
            text-shadow: 
              0 1px 0 ${themeColors.tint}dd,
              0 2px 0 ${themeColors.accent},
              0 4px 6px ${themeColors.tint}66;
            cursor: default;
          }
        `}</style>
      )}

      <View style={[styles.headerContent, { maxWidth: 1200 }]}>
        {/* Logo */}
        <TouchableOpacity onPress={() => handleNav('/')} activeOpacity={0.8} style={styles.logoBtn}>
          <Text className="text-3d-hologram" style={[styles.logoText, { color: themeColors.text }]}>
            Arvin<Text style={{ color: themeColors.tint }}>.</Text>
          </Text>
        </TouchableOpacity>

        {/* Desktop Links */}
        {!isMobileWeb && (
          <View style={styles.navLinks}>
            <TouchableOpacity className="nav-link-3d" onPress={() => handleNav('/')} style={styles.linkItem}>
              <Text 
                style={[
                  styles.linkText, 
                  { color: activeTab === 'home' ? themeColors.tint : themeColors.text }
                ]}
              >
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="nav-link-3d" onPress={() => handleNav('/about')} style={styles.linkItem}>
              <Text 
                style={[
                  styles.linkText, 
                  { color: activeTab === 'about' ? themeColors.tint : themeColors.text }
                ]}
              >
                About
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="nav-link-3d" onPress={() => handleNav('/services')} style={styles.linkItem}>
              <Text 
                style={[
                  styles.linkText, 
                  { color: activeTab === 'services' ? themeColors.tint : themeColors.text }
                ]}
              >
                Services
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="nav-link-3d" onPress={() => handleNav('/portfolio')} style={styles.linkItem}>
              <Text 
                style={[
                  styles.linkText, 
                  { color: activeTab === 'portfolio' ? themeColors.tint : themeColors.text }
                ]}
              >
                Portfolio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="nav-link-3d" onPress={() => handleNav('/contacts')} style={styles.linkItem}>
              <Text 
                style={[
                  styles.linkText, 
                  { color: activeTab === 'contacts' ? themeColors.tint : themeColors.text }
                ]}
              >
                Contact
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="nav-link-3d" onPress={() => setIsSettingsOpen(true)} style={styles.linkItem}>
              <Ionicons 
                className="icon-3d-rotate" 
                name="settings-outline" 
                size={22} 
                color={themeColors.text} 
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Hamburger Menu button for Mobile Web viewports */}
        {isMobileWeb && (
          <TouchableOpacity 
            onPress={() => setIsMobileMenuOpen(prev => !prev)}
            style={styles.hamburgerBtn}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isMobileMenuOpen ? "close-outline" : "menu-outline"} 
              size={28} 
              color={themeColors.text} 
            />
          </TouchableOpacity>
        )}
      </View>
      <SettingsModal visible={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      {isMobileWeb && isMobileMenuOpen && (
        <View style={[styles.mobileMenuDropdown, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
          <TouchableOpacity style={styles.mobileMenuItem} onPress={() => { handleNav('/'); setIsMobileMenuOpen(false); }}>
            <Text style={[styles.mobileMenuText, { color: activeTab === 'home' ? themeColors.tint : themeColors.text }]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileMenuItem} onPress={() => { handleNav('/about'); setIsMobileMenuOpen(false); }}>
            <Text style={[styles.mobileMenuText, { color: activeTab === 'about' ? themeColors.tint : themeColors.text }]}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileMenuItem} onPress={() => { handleNav('/services'); setIsMobileMenuOpen(false); }}>
            <Text style={[styles.mobileMenuText, { color: activeTab === 'services' ? themeColors.tint : themeColors.text }]}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileMenuItem} onPress={() => { handleNav('/portfolio'); setIsMobileMenuOpen(false); }}>
            <Text style={[styles.mobileMenuText, { color: activeTab === 'portfolio' ? themeColors.tint : themeColors.text }]}>Portfolio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileMenuItem} onPress={() => { handleNav('/contacts'); setIsMobileMenuOpen(false); }}>
            <Text style={[styles.mobileMenuText, { color: activeTab === 'contacts' ? themeColors.tint : themeColors.text }]}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mobileMenuItem, { borderBottomWidth: 0 }]} onPress={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' }}>
              <Ionicons name="settings-outline" size={18} color={themeColors.text} style={{ marginRight: 8 }} />
              <Text style={[styles.mobileMenuText, { color: themeColors.text }]}>Settings</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 80,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
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
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 36,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  linkItem: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
  linkText: {
    fontSize: 19,
    fontWeight: '600',
  },
  hamburgerBtn: {
    padding: 6,
    backgroundColor: 'transparent',
  },
  mobileMenuDropdown: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  mobileMenuItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 116, 139, 0.08)',
    backgroundColor: 'transparent',
  },
  mobileMenuText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
