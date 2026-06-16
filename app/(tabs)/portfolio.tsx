import React, { useState } from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Platform, Modal, Dimensions, useWindowDimensions, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { portfolioData, Project, Certificate } from '@/constants/portfolioData';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import WebHeader from '@/components/WebHeader';

const { height } = Dimensions.get('window');

export default function PortfolioScreen() {
  // Initialize projects and certificates in State for CRUD operations
  const [projects, setProjects] = useState<Project[]>(portfolioData.projects);
  const [certificates, setCertificates] = useState<Certificate[]>(portfolioData.certificates);

  const [activeTab, setActiveTab] = useState<'projects' | 'certificates'>('projects');
  
  // Modal states for Large Certificate preview
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  
  // Modal states for Upload Form
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'project' | 'certificate'>('project');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIssuer, setNewIssuer] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newImgUrl, setNewImgUrl] = useState('');
  const [newPdfUrl, setNewPdfUrl] = useState('');

  const { width } = useWindowDimensions();
  const isLargeScreen = width > 990;
  const isMediumScreen = width > 640 && width <= 990;
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't open URL", err));
  };

  const handleOpenPDF = async (pdfUrl: string) => {
    try {
      await WebBrowser.openBrowserAsync(pdfUrl);
    } catch (error) {
      console.log('Error opening browser:', error);
      openLink(pdfUrl);
    }
  };

  // Delete an item from the list
  const handleDelete = (id: string, type: 'project' | 'certificate') => {
    if (type === 'project') {
      setProjects(prev => prev.filter(p => p.id !== id));
    } else {
      setCertificates(prev => prev.filter(c => c.id !== id));
    }
  };

  // Create/Upload a new item
  const handleUploadSubmit = () => {
    if (!newTitle.trim()) return;

    const newId = Date.now().toString();
    const imageAsset = newImgUrl.trim() 
      ? { uri: newImgUrl.trim() } 
      : (uploadType === 'project' 
          ? require('../../assets/images/project_web.png') // default mockup
          : require('../../assets/images/certificate_claude.png'));

    if (uploadType === 'project') {
      const newProj: Project = {
        id: newId,
        title: newTitle.trim(),
        description: newDesc.trim() || 'No description provided.',
        techStack: newTags.split(',').map(t => t.trim()).filter(t => t !== ''),
        image: imageAsset,
        githubUrl: 'https://github.com/arvincatalbas',
        liveUrl: 'https://github.com/arvincatalbas',
      };
      setProjects(prev => [newProj, ...prev]);
    } else {
      const newCert: Certificate = {
        id: newId,
        title: newTitle.trim(),
        issuer: newIssuer.trim() || 'Self-Issued',
        issueDate: newDate.trim() || 'Certified',
        image: imageAsset,
        pdfUrl: newPdfUrl.trim() || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      };
      setCertificates(prev => [newCert, ...prev]);
    }

    // Reset fields
    setNewTitle('');
    setNewDesc('');
    setNewIssuer('');
    setNewDate('');
    setNewTags('');
    setNewImgUrl('');
    setNewPdfUrl('');
    setIsUploadModalOpen(false);
  };

  // Mathematically calculate precise card width to avoid wrapping errors
  const padding = 24;
  const gap = 20;
  const containerMaxWidth = 1100;
  const currentContainerWidth = Math.min(width, containerMaxWidth) - (padding * 2);

  const getCardWidth = () => {
    if (isLargeScreen) {
      return (currentContainerWidth - (gap * 2)) / 3;
    }
    if (isMediumScreen) {
      return (currentContainerWidth - gap) / 2;
    }
    return '100%';
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Custom Sticky Header for Web */}
      <WebHeader activeTab="portfolio" />

      {/* Main Content Area */}
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { maxWidth: containerMaxWidth }
        ]}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Title Header */}
        <View style={styles.webHeader}>
          <Text style={[styles.webTitle, { color: themeColors.text }]}>
            Latest <Text style={{ color: themeColors.tint }}>Project</Text>
          </Text>
        </View>

        {/* Tab & Upload controls wrapper */}
        <View style={[styles.controlsRow, { flexDirection: isLargeScreen ? 'row' : 'column', gap: 16 }]}>
          {/* Tab Selection Segmented Control */}
          <View style={[
            styles.tabBar, 
            { 
              backgroundColor: themeColors.card, 
              borderColor: themeColors.border,
              maxWidth: 400,
              flex: isLargeScreen ? 1 : undefined,
              width: '100%',
              marginBottom: 0,
            }
          ]}>
            <TouchableOpacity 
              style={[
                styles.tabButton, 
                activeTab === 'projects' && { backgroundColor: themeColors.tint }
              ]}
              onPress={() => setActiveTab('projects')}
              activeOpacity={0.8}
            >
              <Ionicons 
                name="images-outline" 
                size={18} 
                color={activeTab === 'projects' ? (colorScheme === 'dark' ? '#1f242d' : '#FFFFFF') : themeColors.secondaryText} 
                style={{ marginRight: 6 }}
              />
              <Text 
                style={[
                  styles.tabText, 
                  { color: activeTab === 'projects' ? (colorScheme === 'dark' ? '#1f242d' : '#FFFFFF') : themeColors.secondaryText}
                ]}
              >
                Projects
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.tabButton, 
                activeTab === 'certificates' && { backgroundColor: themeColors.tint }
              ]}
              onPress={() => setActiveTab('certificates')}
              activeOpacity={0.8}
            >
              <Ionicons 
                name="ribbon-outline" 
                size={18} 
                color={activeTab === 'certificates' ? (colorScheme === 'dark' ? '#1f242d' : '#FFFFFF') : themeColors.secondaryText}
                style={{ marginRight: 6 }}
              />
              <Text 
                style={[
                  styles.tabText, 
                  { color: activeTab === 'certificates' ? (colorScheme === 'dark' ? '#1f242d' : '#FFFFFF') : themeColors.secondaryText }
                ]}
              >
                Certificates
              </Text>
            </TouchableOpacity>
          </View>

          {/* Upload Button */}
          <TouchableOpacity 
            style={[styles.uploadBtn, { backgroundColor: themeColors.tint, shadowColor: themeColors.tint }]}
            onPress={() => setIsUploadModalOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="cloud-upload-outline" size={20} color={colorScheme === 'dark' ? '#1f242d' : '#FFFFFF'} />
            <Text style={[styles.uploadBtnText, { color: colorScheme === 'dark' ? '#1f242d' : '#FFFFFF' }]}>Add Work</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'projects' ? (
          /* Projects Gallery */
          <View style={[
            styles.listContainer,
            { 
              flexDirection: (isLargeScreen || isMediumScreen) ? 'row' : 'column',
              flexWrap: (isLargeScreen || isMediumScreen) ? 'wrap' : 'nowrap',
              gap: gap,
              marginTop: 32,
            }
          ]}>
            {projects.map((project: Project) => (
              <View 
                key={project.id} 
                style={[
                  styles.card, 
                  { 
                    backgroundColor: themeColors.card, 
                    borderColor: themeColors.border,
                    width: getCardWidth(),
                  }
                ]}
              >
                {/* Full-width Image Area */}
                <View style={styles.imageContainer}>
                  <Image source={project.image} style={styles.projectImage} resizeMode="cover" />
                  
                  {/* Delete Button overlay */}
                  <TouchableOpacity 
                    style={styles.deleteOverlay}
                    onPress={() => handleDelete(project.id, 'project')}
                  >
                    <Ionicons name="trash" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: themeColors.text }]} numberOfLines={1}>{project.title}</Text>
                  <Text style={[styles.cardDesc, { color: themeColors.secondaryText }]} numberOfLines={2}>{project.description}</Text>
                  
                  {/* Tech Tags */}
                  <View style={styles.tagsContainer}>
                    {project.techStack.map((tech, idx) => (
                      <View 
                        key={idx} 
                        style={[
                          styles.tag, 
                          { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#F1F5F9' }
                        ]}
                      >
                        <Text style={[styles.tagText, { color: themeColors.tint }]}>{tech}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Links */}
                  <View style={styles.linksContainer}>
                    <TouchableOpacity 
                      style={[styles.linkButton, { borderColor: themeColors.tint }]}
                      onPress={() => openLink(project.githubUrl)}
                    >
                      <Ionicons name="logo-github" size={14} color={themeColors.tint} />
                      <Text style={[styles.linkText, { color: themeColors.tint }]}>GitHub</Text>
                    </TouchableOpacity>

                    {project.liveUrl && (
                      <TouchableOpacity 
                        style={[styles.linkButton, { backgroundColor: themeColors.tint, borderColor: themeColors.tint }]}
                        onPress={() => openLink(project.liveUrl!)}
                      >
                        <Text style={[styles.linkText, { color: colorScheme === 'dark' ? '#1f242d' : '#FFFFFF' }]}>Live Demo</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          /* Certificates Gallery */
          <View style={[
            styles.listContainer,
            { 
              flexDirection: (isLargeScreen || isMediumScreen) ? 'row' : 'column',
              flexWrap: (isLargeScreen || isMediumScreen) ? 'wrap' : 'nowrap',
              gap: gap,
              marginTop: 32,
            }
          ]}>
            {certificates.map((cert: Certificate) => (
              <View 
                key={cert.id} 
                style={[
                  styles.card, 
                  { 
                    backgroundColor: themeColors.card, 
                    borderColor: themeColors.border,
                    width: getCardWidth(),
                  }
                ]}
              >
                {/* Certificate Preview Image */}
                <TouchableOpacity 
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedImage(cert.image);
                    setSelectedTitle(cert.title);
                  }}
                  style={styles.imageBtn}
                >
                  <Image source={cert.image} style={styles.certImage} resizeMode="contain" />
                  
                  {/* Delete Button overlay */}
                  <TouchableOpacity 
                    style={styles.deleteOverlay}
                    onPress={() => handleDelete(cert.id, 'certificate')}
                  >
                    <Ionicons name="trash" size={18} color="#EF4444" />
                  </TouchableOpacity>

                  <View style={styles.zoomOverlay}>
                    <Ionicons name="scan-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.zoomText}>View Large</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: themeColors.text }]} numberOfLines={1}>{cert.title}</Text>
                  <Text style={[styles.certSubtitle, { color: themeColors.secondaryText }]}>
                    {cert.issuer} • {cert.issueDate}
                  </Text>

                  {/* Actions */}
                  <View style={styles.linksContainer}>
                    <TouchableOpacity 
                      style={[styles.actionBtnPrimary, { backgroundColor: themeColors.tint, shadowColor: themeColors.tint }]}
                      onPress={() => handleOpenPDF(cert.pdfUrl)}
                    >
                      <Text style={[styles.actionBtnText, { color: colorScheme === 'dark' ? '#1f242d' : '#FFFFFF' }]}>View PDF</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.actionBtnSecondary, { borderColor: themeColors.border }]}
                      onPress={() => {
                        setSelectedImage(cert.image);
                        setSelectedTitle(cert.title);
                      }}
                    >
                      <Text style={[styles.actionBtnTextSec, { color: themeColors.text }]}>Preview</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Image Modal for Certificate Zoom View */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity 
            style={styles.modalCloseArea} 
            activeOpacity={1} 
            onPress={() => setSelectedImage(null)}
          />
          
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedTitle}</Text>
              <TouchableOpacity 
                style={styles.closeBtn} 
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close-circle" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {selectedImage && (
              <Image 
                source={selectedImage} 
                style={styles.modalImage} 
                resizeMode="contain" 
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Modal for Adding new Work (Upload Form) */}
      <Modal
        visible={isUploadModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsUploadModalOpen(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity 
            style={styles.modalCloseArea} 
            activeOpacity={1} 
            onPress={() => setIsUploadModalOpen(false)}
          />
          
          <View style={[styles.uploadFormCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <View style={styles.formHeader}>
              <Text style={[styles.formTitle, { color: themeColors.text }]}>Add New Work</Text>
              <TouchableOpacity onPress={() => setIsUploadModalOpen(false)}>
                <Ionicons name="close-circle" size={28} color={themeColors.tint} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
              {/* Selector Type */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: themeColors.text }]}>Work Type</Text>
                <View style={styles.typeSelectorRow}>
                  <TouchableOpacity 
                    style={[styles.typeSelectBtn, uploadType === 'project' && { backgroundColor: themeColors.tint }]}
                    onPress={() => setUploadType('project')}
                  >
                    <Text style={[styles.typeSelectBtnText, { color: uploadType === 'project' ? (colorScheme === 'dark' ? '#1f242d' : '#FFFFFF') : themeColors.text }]}>Project</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.typeSelectBtn, uploadType === 'certificate' && { backgroundColor: themeColors.tint }]}
                    onPress={() => setUploadType('certificate')}
                  >
                    <Text style={[styles.typeSelectBtnText, { color: uploadType === 'certificate' ? (colorScheme === 'dark' ? '#1f242d' : '#FFFFFF') : themeColors.text }]}>Certificate</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Title */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: themeColors.text }]}>Title *</Text>
                <TextInput 
                  style={[styles.textInput, { backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
                  placeholder="e.g. Cisco Networking Essentials"
                  placeholderTextColor={themeColors.secondaryText}
                  value={newTitle}
                  onChangeText={setNewTitle}
                />
              </View>

              {/* Conditional Description for Projects */}
              {uploadType === 'project' && (
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: themeColors.text }]}>Description</Text>
                  <TextInput 
                    style={[styles.textInput, styles.textarea, { backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
                    placeholder="Describe your project details..."
                    placeholderTextColor={themeColors.secondaryText}
                    multiline={true}
                    numberOfLines={3}
                    textAlignVertical="top"
                    value={newDesc}
                    onChangeText={setNewDesc}
                  />
                </View>
              )}

              {/* Conditional Tags for Projects */}
              {uploadType === 'project' && (
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: themeColors.text }]}>Tech Stack Tags (comma separated)</Text>
                  <TextInput 
                    style={[styles.textInput, { backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
                    placeholder="e.g. React Native, Expo, Redux"
                    placeholderTextColor={themeColors.secondaryText}
                    value={newTags}
                    onChangeText={setNewTags}
                  />
                </View>
              )}

              {/* Conditional Issuer for Certificates */}
              {uploadType === 'certificate' && (
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: themeColors.text }]}>Issuer</Text>
                  <TextInput 
                    style={[styles.textInput, { backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
                    placeholder="e.g. Cisco Networking Academy"
                    placeholderTextColor={themeColors.secondaryText}
                    value={newIssuer}
                    onChangeText={setNewIssuer}
                  />
                </View>
              )}

              {/* Conditional Date for Certificates */}
              {uploadType === 'certificate' && (
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: themeColors.text }]}>Issue Date</Text>
                  <TextInput 
                    style={[styles.textInput, { backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
                    placeholder="e.g. Certified / Jan 2025"
                    placeholderTextColor={themeColors.secondaryText}
                    value={newDate}
                    onChangeText={setNewDate}
                  />
                </View>
              )}

              {/* Picture Upload/Link URL */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: themeColors.text }]}>Picture URL (Leave blank to use template mockup)</Text>
                <TextInput 
                  style={[styles.textInput, { backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
                  placeholder="https://example.com/screenshot.png"
                  placeholderTextColor={themeColors.secondaryText}
                  value={newImgUrl}
                  onChangeText={setNewImgUrl}
                />
              </View>

              {/* PDF Upload/Link URL for Certificates */}
              {uploadType === 'certificate' && (
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: themeColors.text }]}>Credential PDF URL</Text>
                  <TextInput 
                    style={[styles.textInput, { backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
                    placeholder="https://example.com/certificate.pdf"
                    placeholderTextColor={themeColors.secondaryText}
                    value={newPdfUrl}
                    onChangeText={setNewPdfUrl}
                  />
                </View>
              )}

              {/* Action Submit */}
              <TouchableOpacity 
                style={[styles.submitFormBtn, { backgroundColor: themeColors.tint, shadowColor: themeColors.tint }]}
                onPress={handleUploadSubmit}
                activeOpacity={0.8}
              >
                <Text style={[styles.submitFormBtnText, { color: colorScheme === 'dark' ? '#1f242d' : '#FFFFFF' }]}>Upload Work</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webHeader: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  webTitle: {
    fontSize: 44,
    fontWeight: '900',
  },
  controlsRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 32,
    maxWidth: 1024,
    paddingHorizontal: 24,
  },
  tabBar: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 4,
    minWidth: 160,
  },
  uploadBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 60,
    width: '100%',
    alignSelf: 'center',
  },
  listContainer: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  projectImage: {
    width: '100%',
    height: '100%',
  },
  deleteOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  imageBtn: {
    position: 'relative',
    width: '100%',
    height: 160,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 116, 139, 0.08)',
  },
  certImage: {
    width: '90%',
    height: '90%',
  },
  zoomOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  zoomText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  certSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  linksContainer: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'transparent',
    marginTop: 'auto',
  },
  linkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionBtnPrimary: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  actionBtnTextSec: {
    fontSize: 15,
    fontWeight: '700',
  },
  /* Modal Styles */
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    zIndex: 10,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  closeBtn: {
    backgroundColor: 'transparent',
  },
  modalImage: {
    width: '100%',
    height: height * 0.6,
    borderRadius: 8,
  },
  /* Upload Form Styles */
  uploadFormCard: {
    width: '90%',
    maxWidth: 540,
    maxHeight: '85%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    zIndex: 10,
    elevation: 5,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  formScroll: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  inputGroup: {
    backgroundColor: 'transparent',
    marginBottom: 16,
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'transparent',
  },
  typeSelectBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#3e4553',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  typeSelectBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  textInput: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    fontSize: 15,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  textarea: {
    height: 90,
    paddingTop: 12,
    paddingBottom: 12,
  },
  submitFormBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 3,
  },
  submitFormBtnText: {
    fontSize: 17,
    fontWeight: '700',
  },
});
