import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TextInput, TouchableOpacity, Linking, Platform, KeyboardAvoidingView, useWindowDimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { portfolioData } from '@/constants/portfolioData';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import WebHeader from '@/components/WebHeader';

export default function ContactsScreen() {
  const params = useLocalSearchParams<{ subject?: string }>();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { profile } = portfolioData;

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Validation & Status
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  // Pre-fill subject if passed via route parameters
  useEffect(() => {
    if (params.subject) {
      setSubject(params.subject);
    }
  }, [params.subject]);

  const openUrl = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't open URL", err));
  };

  const validate = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!name.trim()) tempErrors.name = 'Name is required';
    if (!message.trim()) tempErrors.message = 'Message is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setSubmittedData({ name, email, phone, subject, message });
      setIsSubmitted(true);
    }
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
    setErrors({});
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* Custom Sticky Header for Web */}
      <WebHeader activeTab="contacts" />

      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { maxWidth: 768 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Header */}
        <View style={styles.webHeader}>
          <Text style={[styles.webTitle, { color: themeColors.text }]}>
            Contact <Text style={{ color: themeColors.tint }}>Me!</Text>
          </Text>
          <Text style={[styles.headerSubtitle, { color: themeColors.secondaryText }]}>
            Have an exciting project idea or want to work together? Let's connect!
          </Text>
        </View>

        {/* Contact Info Cards */}
        <View style={styles.infoRow}>
          <TouchableOpacity 
            style={[styles.infoCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => openUrl(`mailto:${profile.email}`)}
          >
            <Ionicons name="mail-outline" size={20} color={themeColors.tint} />
            <Text style={[styles.infoVal, { color: themeColors.text }]} numberOfLines={1}>{profile.email}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.infoCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => openUrl(`tel:${profile.phone}`)}
          >
            <Ionicons name="call-outline" size={20} color={themeColors.tint} />
            <Text style={[styles.infoVal, { color: themeColors.text }]}>{profile.phone}</Text>
          </TouchableOpacity>
        </View>

        {isSubmitted ? (
          /* Submission Success State */
          <View style={[styles.successCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <View style={[styles.successIconCircle, { backgroundColor: themeColors.accent + '20' }]}>
              <Ionicons name="checkmark-circle" size={48} color={themeColors.accent} />
            </View>
            <Text style={[styles.successTitle, { color: themeColors.text }]}>Message Sent!</Text>
            <Text style={[styles.successDesc, { color: themeColors.secondaryText }]}>
              Thank you, {submittedData?.name}. I will review your message and reply back to {submittedData?.email} within 24 hours.
            </Text>

            {/* Summary Details */}
            <View style={[styles.summaryContainer, { backgroundColor: colorScheme === 'dark' ? '#1f242d' : '#F8FAFC', borderColor: themeColors.border }]}>
              <Text style={[styles.summaryLabel, { color: themeColors.secondaryText }]}>Message Details:</Text>
              <Text style={[styles.summaryText, { color: themeColors.text }]}><Text style={{ fontWeight: 'bold' }}>Subject:</Text> {submittedData?.subject || 'N/A'}</Text>
              <Text style={[styles.summaryText, { color: themeColors.text }]}><Text style={{ fontWeight: 'bold' }}>Message:</Text> {submittedData?.message}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.resetButton, { backgroundColor: themeColors.tint }]}
              onPress={handleResetForm}
              activeOpacity={0.8}
            >
              <Text style={[styles.resetButtonText, { color: colorScheme === 'dark' ? '#1f242d' : '#FFFFFF' }]}>Send Another Message</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Contact Form */
          <View style={styles.formContainer}>
            
            {/* 2-Column Grid Inputs for Desktop, Stacked for Mobile */}
            <View style={[styles.formGrid, { flexDirection: isLargeScreen ? 'row' : 'column', gap: 16 }]}>
              <View style={styles.gridColumn}>
                <TextInput 
                  style={[
                    styles.textInput, 
                    { 
                      backgroundColor: themeColors.card, 
                      color: themeColors.text,
                      borderColor: errors.name ? '#EF4444' : themeColors.border 
                    }
                  ]}
                  placeholder="Full Name"
                  placeholderTextColor={themeColors.secondaryText}
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.gridColumn}>
                <TextInput 
                  style={[
                    styles.textInput, 
                    { 
                      backgroundColor: themeColors.card, 
                      color: themeColors.text,
                      borderColor: errors.email ? '#EF4444' : themeColors.border 
                    }
                  ]}
                  placeholder="Email Address"
                  placeholderTextColor={themeColors.secondaryText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>
            </View>

            <View style={[styles.formGrid, { flexDirection: isLargeScreen ? 'row' : 'column', gap: 16, marginTop: 16 }]}>
              <View style={styles.gridColumn}>
                <TextInput 
                  style={[
                    styles.textInput, 
                    { 
                      backgroundColor: themeColors.card, 
                      color: themeColors.text,
                      borderColor: themeColors.border 
                    }
                  ]}
                  placeholder="Mobile Number"
                  placeholderTextColor={themeColors.secondaryText}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <View style={styles.gridColumn}>
                <TextInput 
                  style={[
                    styles.textInput, 
                    { 
                      backgroundColor: themeColors.card, 
                      color: themeColors.text,
                      borderColor: themeColors.border 
                    }
                  ]}
                  placeholder="Email Subject"
                  placeholderTextColor={themeColors.secondaryText}
                  value={subject}
                  onChangeText={setSubject}
                />
              </View>
            </View>

            {/* Message Input - Full Width */}
            <View style={[styles.inputGroup, { marginTop: 16 }]}>
              <TextInput 
                style={[
                  styles.textInput, 
                  styles.messageInput,
                  { 
                    backgroundColor: themeColors.card, 
                    color: themeColors.text,
                    borderColor: errors.message ? '#EF4444' : themeColors.border 
                  }
                ]}
                placeholder="Your Message"
                placeholderTextColor={themeColors.secondaryText}
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
                value={message}
                onChangeText={(val) => {
                  setMessage(val);
                  if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
                }}
              />
              {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}
            </View>

            {/* Submit Button - Neon Cyan Centered with drop shadow glow */}
            <View style={styles.btnCenterWrapper}>
              <TouchableOpacity 
                style={[styles.submitButton, { backgroundColor: themeColors.tint, shadowColor: themeColors.tint }]}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={[styles.submitButtonText, { color: colorScheme === 'dark' ? '#1f242d' : '#FFFFFF' }]}>Send Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 60,
  },
  webHeader: {
    alignItems: 'center',
    marginBottom: 32,
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
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  infoCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  infoVal: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'left',
  },
  formContainer: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  formGrid: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  gridColumn: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  inputGroup: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  textInput: {
    height: 52,
    borderRadius: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    fontSize: 17,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  messageInput: {
    height: 160,
    paddingTop: 12,
    paddingBottom: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  btnCenterWrapper: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 32,
  },
  submitButton: {
    height: 52,
    paddingHorizontal: 48,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  /* Success Card Styles */
  successCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  summaryContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  resetButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
