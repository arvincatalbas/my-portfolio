import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { portfolioData, Service } from '@/constants/portfolioData';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import WebHeader from '@/components/WebHeader';
import NetworkBackground from '@/components/NetworkBackground';

export default function ServicesScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 990;
  const isMediumScreen = width > 640 && width <= 990;
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { services } = portfolioData;

  const handleInquiry = (serviceTitle: string) => {
    router.push({
      pathname: '/contacts',
      params: { subject: `Inquiry regarding ${serviceTitle}` }
    });
  };

  // Responsive design tokens
  const titleSize = isLargeScreen ? 48 : (isMediumScreen ? 40 : 32);
  const subtitleSize = isLargeScreen ? 20 : (isMediumScreen ? 17 : 14);
  const cardTitleSize = isLargeScreen ? 24 : (isMediumScreen ? 21 : 18);
  const cardDescSize = isLargeScreen ? 16 : (isMediumScreen ? 14 : 13);
  const cardDescLineHeight = isLargeScreen ? 24 : (isMediumScreen ? 21 : 19);
  const featureTextSize = isLargeScreen ? 16 : (isMediumScreen ? 14 : 13);
  const featureDotSize = isLargeScreen ? 8 : (isMediumScreen ? 6 : 5);
  const buttonTextSize = isLargeScreen ? 16 : (isMediumScreen ? 14 : 13);
  const buttonHeight = isLargeScreen ? 52 : (isMediumScreen ? 46 : 42);
  const cardIconSize = isLargeScreen ? 40 : (isMediumScreen ? 34 : 28);
  const iconContainerSize = isLargeScreen ? 72 : (isMediumScreen ? 62 : 52);
  const cardPadding = isLargeScreen ? 28 : (isMediumScreen ? 22 : 16);

  // Mathematically calculate precise card width to avoid wrapping errors
  const padding = isLargeScreen ? 32 : (isMediumScreen ? 24 : 16);
  const gap = isLargeScreen ? 28 : (isMediumScreen ? 20 : 16);
  const containerMaxWidth = 1100;
  const currentContainerWidth = Math.min(width, containerMaxWidth) - (padding * 2);

  const getCardWidth = () => {
    if (isLargeScreen) {
      return (currentContainerWidth - (gap * 3)) / 4; // 4 columns side-by-side
    }
    if (isMediumScreen) {
      return (currentContainerWidth - gap) / 2; // 2 columns
    }
    return '100%'; // 1 column
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: themeColors.background }]}>
      <NetworkBackground />
      {/* 3D Animations for Services Cards */}
      {Platform.OS === 'web' && (
        <style>{`
          .service-card-3d {
            transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            transform-style: preserve-3d;
            perspective: 1000px;
          }
          .service-card-3d:hover {
            transform: translateY(-10px) rotateX(3deg) rotateY(-3deg) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 238, 255, 0.2) !important;
            border-color: #00eeff !important;
          }
          .service-card-3d:hover .icon-3d {
            transform: translateZ(40px) scale(1.1);
          }
          .service-card-3d:hover .text-3d {
            transform: translateZ(25px);
          }
          .icon-3d, .text-3d {
            transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
          }
        `}</style>
      )}

      {/* Custom Sticky Header for Web */}
      <WebHeader activeTab="services" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { maxWidth: containerMaxWidth, padding: padding }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Header */}
        <View style={styles.webHeader}>
          <Text className="text-3d-hologram" style={[styles.webTitle, { color: themeColors.text, fontSize: titleSize }]}>
            Our <Text style={{ color: themeColors.tint }}>Services</Text>
          </Text>
          <Text style={[styles.headerSubtitle, { color: themeColors.secondaryText, fontSize: subtitleSize, lineHeight: subtitleSize * 1.4 }]}>
            High-impact engineering solutions designed to grow your business.
          </Text>
        </View>
 
        <View style={[
          styles.servicesGrid, 
          { 
            flexDirection: (isLargeScreen || isMediumScreen) ? 'row' : 'column', 
            flexWrap: (isLargeScreen || isMediumScreen) ? 'wrap' : 'nowrap',
            gap: gap 
          }
        ]}>
          {services.map((service: Service) => {
            let iconName: any = 'help-circle-outline';
            if (service.icon === 'smartphone') iconName = 'code-slash-outline';
            else if (service.icon === 'globe') iconName = 'globe-outline';
            else if (service.icon === 'color-wand') iconName = 'brush-outline';
            else if (service.icon === 'chatbubbles') iconName = 'trending-up-outline';

            return (
              <View 
                key={service.id} 
                className="service-card-3d"
                style={[
                  styles.serviceCard, 
                  { 
                    backgroundColor: themeColors.card, 
                    borderColor: themeColors.border,
                    width: getCardWidth(),
                    padding: cardPadding,
                  }
                ]}
              >
                {/* Centered Icon */}
                <View className="icon-3d" style={[styles.iconContainer, { width: iconContainerSize, height: iconContainerSize, borderRadius: iconContainerSize / 2 }]}>
                  <Ionicons className="icon-3d-rotate" name={iconName} size={cardIconSize} color={themeColors.tint} />
                </View>
 
                {/* Title */}
                <Text className="text-3d text-3d-hologram" style={[styles.cardTitle, { color: themeColors.text, fontSize: cardTitleSize }]}>{service.title}</Text>
 
                {/* Description */}
                <Text style={[styles.cardDescription, { color: themeColors.secondaryText, fontSize: cardDescSize, lineHeight: cardDescLineHeight }]}>
                  {service.description}
                </Text>
 
                {/* Features List */}
                <View style={styles.featuresContainer}>
                  {service.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureItem}>
                      <Ionicons name="ellipse" size={featureDotSize} color={themeColors.tint} style={{ marginRight: 6 }} />
                      <Text style={[styles.featureText, { color: themeColors.text, fontSize: featureTextSize }]}>{feature}</Text>
                    </View>
                  ))}
                </View>
 
                {/* Action Button - Neon Pill Style with shadow glow */}
                <TouchableOpacity
                  className="btn-3d"
                  style={[styles.inquireButton, { backgroundColor: themeColors.tint, shadowColor: themeColors.tint, height: buttonHeight, borderRadius: buttonHeight / 2 }]}
                  onPress={() => handleInquiry(service.title)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.inquireButtonText, { color: colorScheme === 'dark' ? '#1f242d' : '#ffffff', fontSize: buttonTextSize }]}>Read More</Text>
                </TouchableOpacity>
              </View>
            );
          })}
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
    paddingBottom: 60,
  },
  webHeader: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  webTitle: {
    fontSize: 44,
    fontWeight: '900',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 520,
  },
  servicesGrid: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  serviceCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
    minHeight: 40,
  },
  featuresContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    gap: 8,
    marginBottom: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(100, 116, 139, 0.1)',
    paddingTop: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
  },
  inquireButton: {
    height: 52,
    paddingHorizontal: 28,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    width: '100%',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 4,
  },
  inquireButtonText: {
    fontSize: 17,
    fontWeight: '700',
  },
});
