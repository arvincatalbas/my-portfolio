import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { portfolioData, Service } from '@/constants/portfolioData';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import WebHeader from '@/components/WebHeader';

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

  // Mathematically calculate precise card width to avoid wrapping errors
  const padding = 24;
  const gap = 24;
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
      {/* Custom Sticky Header for Web */}
      <WebHeader activeTab="services" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { maxWidth: containerMaxWidth }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Header */}
        <View style={styles.webHeader}>
          <Text style={[styles.webTitle, { color: themeColors.text }]}>
            Our <Text style={{ color: themeColors.tint }}>Services</Text>
          </Text>
          <Text style={[styles.headerSubtitle, { color: themeColors.secondaryText }]}>
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
                style={[
                  styles.serviceCard, 
                  { 
                    backgroundColor: themeColors.card, 
                    borderColor: themeColors.border,
                    width: getCardWidth(),
                  }
                ]}
              >
                {/* Centered Icon */}
                <View style={styles.iconContainer}>
                  <Ionicons name={iconName} size={36} color={themeColors.tint} />
                </View>

                {/* Title */}
                <Text style={[styles.cardTitle, { color: themeColors.text }]}>{service.title}</Text>

                {/* Description */}
                <Text style={[styles.cardDescription, { color: themeColors.secondaryText }]}>
                  {service.description}
                </Text>

                {/* Features List */}
                <View style={styles.featuresContainer}>
                  {service.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureItem}>
                      <Ionicons name="ellipse" size={6} color={themeColors.tint} style={{ marginRight: 6 }} />
                      <Text style={[styles.featureText, { color: themeColors.text }]}>{feature}</Text>
                    </View>
                  ))}
                </View>

                {/* Action Button - Neon Pill Style with shadow glow */}
                <TouchableOpacity
                  style={[styles.inquireButton, { backgroundColor: themeColors.tint, shadowColor: themeColors.tint }]}
                  onPress={() => handleInquiry(service.title)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.inquireButtonText, { color: colorScheme === 'dark' ? '#1f242d' : '#ffffff' }]}>Read More</Text>
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
