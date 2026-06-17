import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Platform, Modal, Dimensions, useWindowDimensions, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { portfolioData, Project, Certificate } from '@/constants/portfolioData';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import WebHeader from '@/components/WebHeader';
import { showDeleteConfirmation } from '@/components/DeleteConfirmation';
import { getIndexedDBItem, setIndexedDBItem } from '@/utils/storage';
import { compressImage } from '@/utils/image';
import Swal from 'sweetalert2';

const { height } = Dimensions.get('window');

export default function PortfolioScreen() {
  const isWeb = Platform.OS === 'web';

  // Initialize projects and certificates in State
  const [projects, setProjects] = useState<Project[]>(portfolioData.projects);
  const [certificates, setCertificates] = useState<Certificate[]>(portfolioData.certificates);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load from IndexedDB on web mount
  useEffect(() => {
    if (isWeb) {
      const loadInitialData = async () => {
        try {
          const storedProjects = await getIndexedDBItem<Project[]>('portfolio_projects');
          const storedCerts = await getIndexedDBItem<Certificate[]>('portfolio_certificates');
          
          if (storedProjects) setProjects(storedProjects);
          if (storedCerts) setCertificates(storedCerts);
        } catch (e) {
          console.error("Failed to load portfolio data from IndexedDB", e);
        } finally {
          setHasLoaded(true);
        }
      };
      loadInitialData();
    } else {
      setHasLoaded(true);
    }
  }, []);

  // Persist state updates to IndexedDB
  useEffect(() => {
    if (isWeb && hasLoaded) {
      setIndexedDBItem('portfolio_projects', projects)
        .catch(e => console.error("Failed to save projects to IndexedDB", e));
    }
  }, [projects, hasLoaded]);

  useEffect(() => {
    if (isWeb && hasLoaded) {
      setIndexedDBItem('portfolio_certificates', certificates)
        .catch(e => console.error("Failed to save certificates to IndexedDB", e));
    }
  }, [certificates, hasLoaded]);

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
  
  // Track item being edited
  const [editingItem, setEditingItem] = useState<{ id: string; type: 'project' | 'certificate' } | null>(null);

  const { width } = useWindowDimensions();
  const isLargeScreen = width > 990;
  const isMediumScreen = width > 640 && width <= 990;
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  useEffect(() => {
    if (Platform.OS === 'web') {
      const timer = setTimeout(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
              }
            });
          },
          { threshold: 0.05 }
        );
        
        const cards = document.querySelectorAll('.portfolio-card-3d');
        cards.forEach((card) => observer.observe(card));
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [projects, certificates, activeTab]);

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't open URL", err));
  };

  const handlePickFile = (type: 'image' | 'pdf') => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = type === 'image' ? 'image/*' : 'application/pdf';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          if (type === 'pdf' && file.size > 2 * 1024 * 1024) {
            Swal.fire({
              title: 'File Too Large',
              text: 'PDF size exceeds the 2MB limit. Please upload a smaller PDF file.',
              icon: 'warning',
              confirmButtonColor: themeColors.tint,
              background: colorScheme === 'dark' ? '#323946' : '#FFFFFF',
              color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937',
            });
            return;
          }
          
          const reader = new FileReader();
          reader.onload = async () => {
            const rawDataUrl = reader.result as string;
            if (type === 'image') {
              try {
                // Compress the image before setting state
                const compressed = await compressImage(rawDataUrl, 1024, 1024, 0.7);
                setNewImgUrl(compressed);
              } catch (compressErr) {
                console.error("Compression failed, using raw image:", compressErr);
                setNewImgUrl(rawDataUrl);
              }
            } else {
              setNewPdfUrl(rawDataUrl);
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      alert("Local file picker is only supported on the Web preview.");
    }
  };

  const handleOpenPDF = async (pdfUrl: string) => {
    if (Platform.OS === 'web' && pdfUrl.startsWith('data:application/pdf;base64,')) {
      try {
        const base64Data = pdfUrl.split(',')[1];
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
      await WebBrowser.openBrowserAsync(pdfUrl);
    } catch (error) {
      console.log('Error opening browser:', error);
      openLink(pdfUrl);
    }
  };

  // Delete an item from the list with confirmation check
  const handleDelete = (id: string, type: 'project' | 'certificate') => {
    const title = type === 'project' ? 'Project' : 'Certificate';
    
    showDeleteConfirmation({
      title: `Delete ${title}`,
      text: `Are you sure you want to delete this ${title.toLowerCase()}?`,
      isDark: colorScheme === 'dark',
      onConfirm: () => {
        if (type === 'project') {
          setProjects(prev => prev.filter(p => p.id !== id));
        } else {
          setCertificates(prev => prev.filter(c => c.id !== id));
        }
      }
    });
  };

  // Start editing an item - pre-fill fields and toggle modal mode
  const handleStartEdit = (item: any, type: 'project' | 'certificate') => {
    setUploadType(type);
    setEditingItem({ id: item.id, type });
    setNewTitle(item.title);
    
    if (type === 'project') {
      setNewDesc(item.description || '');
      setNewTags(item.techStack ? item.techStack.join(', ') : '');
    } else {
      setNewIssuer(item.issuer || '');
      setNewDate(item.issueDate || '');
      setNewPdfUrl(item.pdfUrl || '');
    }
    
    if (item.image && item.image.uri) {
      setNewImgUrl(item.image.uri);
    } else {
      setNewImgUrl('');
    }
    
    setIsUploadModalOpen(true);
  };

  // Reset fields and close modal
  const handleCloseModal = () => {
    setNewTitle('');
    setNewDesc('');
    setNewIssuer('');
    setNewDate('');
    setNewTags('');
    setNewImgUrl('');
    setNewPdfUrl('');
    setEditingItem(null);
    setIsUploadModalOpen(false);
  };

  // Create/Upload or Save edited item
  const handleUploadSubmit = () => {
    if (!newTitle.trim()) return;

    if (editingItem) {
      const { id, type } = editingItem;
      if (type === 'project') {
        setProjects(prev => prev.map(p => {
          if (p.id === id) {
            const updatedImage = newImgUrl.trim() 
              ? { uri: newImgUrl.trim() } 
              : p.image;
              
            return {
              ...p,
              title: newTitle.trim(),
              description: newDesc.trim() || 'No description provided.',
              techStack: newTags.split(',').map(t => t.trim()).filter(t => t !== ''),
              image: updatedImage,
            };
          }
          return p;
        }));
      } else {
        setCertificates(prev => prev.map(c => {
          if (c.id === id) {
            const updatedImage = newImgUrl.trim() 
              ? { uri: newImgUrl.trim() } 
              : c.image;
              
            return {
              ...c,
              title: newTitle.trim(),
              issuer: newIssuer.trim() || 'Self-Issued',
              issueDate: newDate.trim() || 'Certified',
              image: updatedImage,
              pdfUrl: newPdfUrl.trim() || c.pdfUrl,
            };
          }
          return c;
        }));
      }
    } else {
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
          isUploaded: true,
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
          isUploaded: true,
        };
        setCertificates(prev => [newCert, ...prev]);
      }
    }

    handleCloseModal();
  };

  // Responsive design tokens
  const titleSize = isLargeScreen ? 48 : (isMediumScreen ? 40 : 32);
  const subtitleSize = isLargeScreen ? 20 : (isMediumScreen ? 17 : 14);
  const tabTextSize = isLargeScreen ? 18 : (isMediumScreen ? 16 : 14);
  const tabButtonHeight = isLargeScreen ? 44 : (isMediumScreen ? 40 : 36);
  const uploadBtnTextSize = isLargeScreen ? 17 : (isMediumScreen ? 15 : 13);
  const uploadBtnHeight = isLargeScreen ? 54 : (isMediumScreen ? 46 : 42);
  const cardTitleSize = isLargeScreen ? 22 : (isMediumScreen ? 19 : 17);
  const cardDescSize = isLargeScreen ? 16 : (isMediumScreen ? 14 : 13);
  const cardDescLineHeight = isLargeScreen ? 22 : (isMediumScreen ? 20 : 18);
  const tagTextSize = isLargeScreen ? 12 : (isMediumScreen ? 11 : 10);
  const linkTextSize = isLargeScreen ? 15 : (isMediumScreen ? 13 : 12);
  const linkBtnHeight = isLargeScreen ? 44 : (isMediumScreen ? 38 : 34);
  const imageContainerHeight = isLargeScreen ? 200 : (isMediumScreen ? 170 : 140);
  const cardPadding = isLargeScreen ? 20 : (isMediumScreen ? 16 : 12);

  // Mathematically calculate precise card width to avoid wrapping errors
  const padding = isLargeScreen ? 32 : (isMediumScreen ? 24 : 16);
  const gap = isLargeScreen ? 28 : (isMediumScreen ? 20 : 16);
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
      {/* 3D Animations for Portfolio Cards */}
      {Platform.OS === 'web' && (
        <style>{`
          .portfolio-card-3d {
            opacity: 0;
            transform: translateY(40px) rotateX(8deg) scale(0.96);
            transition: opacity 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), 
                        transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1),
                        border-color 0.3s ease,
                        box-shadow 0.3s ease !important;
            transform-style: preserve-3d;
            perspective: 1000px;
          }
          .portfolio-card-3d.in-view {
            opacity: 1;
            transform: translateY(0px) rotateX(0deg) scale(1);
          }
          .portfolio-card-3d.in-view:hover {
            transform: translateY(-8px) rotateX(2.5deg) rotateY(-2.5deg) scale(1.01) !important;
            box-shadow: 0 15px 35px ${themeColors.tint}2e !important;
            border-color: ${themeColors.tint} !important;
          }
          .portfolio-card-3d:hover .image-zoom-3d {
            transform: translateZ(30px) scale(1.03);
          }
          .portfolio-card-3d:hover .text-pop-3d {
            transform: translateZ(15px);
          }
          .image-zoom-3d, .text-pop-3d {
            transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
          }

          /* SweetAlert Premium Theme Styles */
          .swal2-container {
            background-color: rgba(0, 0, 0, 0.25) !important;
            backdrop-filter: blur(4px) !important;
            -webkit-backdrop-filter: blur(4px) !important;
          }
          .swal2-popup.swal-premium-popup {
            border-radius: 24px !important;
            border: 1px solid ${themeColors.border} !important;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35) !important;
            font-family: 'Outfit', 'Montserrat', sans-serif !important;
          }
          .swal2-styled.swal2-confirm {
            border-radius: 12px !important;
            font-family: 'Outfit', 'Montserrat', sans-serif !important;
            font-weight: 600 !important;
            padding: 10px 24px !important;
            font-size: 15px !important;
          }
          .swal2-styled.swal2-cancel {
            border-radius: 12px !important;
            font-family: 'Outfit', 'Montserrat', sans-serif !important;
            font-weight: 600 !important;
            padding: 10px 24px !important;
            font-size: 15px !important;
          }
          .swal2-icon {
            border-width: 3px !important;
          }
        `}</style>
      )}

      {/* Custom Sticky Header for Web */}
      <WebHeader activeTab="portfolio" />

      {/* Main Content Area */}
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { maxWidth: containerMaxWidth, paddingHorizontal: padding }
        ]}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Title Header */}
        <View style={styles.webHeader}>
          <Text className="text-3d-hologram" style={[styles.webTitle, { color: themeColors.text, fontSize: titleSize }]}>
            Latest <Text style={{ color: themeColors.tint }}>Work</Text>
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
              className="btn-outline-3d"
              style={[
                styles.tabButton, 
                { height: tabButtonHeight },
                activeTab === 'projects' && { backgroundColor: themeColors.tint }
              ]}
              onPress={() => setActiveTab('projects')}
              activeOpacity={0.8}
            >
              <Ionicons 
                className="icon-3d-rotate"
                name="images-outline" 
                size={tabTextSize + 2} 
                color={activeTab === 'projects' ? (colorScheme === 'dark' ? '#1f242d' : '#FFFFFF') : themeColors.secondaryText} 
                style={{ marginRight: 6 }}
              />
              <Text 
                style={[
                  styles.tabText, 
                  { color: activeTab === 'projects' ? (colorScheme === 'dark' ? '#1f242d' : '#FFFFFF') : themeColors.secondaryText, fontSize: tabTextSize }
                ]}
              >
                Projects
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="btn-outline-3d"
              style={[
                styles.tabButton, 
                { height: tabButtonHeight },
                activeTab === 'certificates' && { backgroundColor: themeColors.tint }
              ]}
              onPress={() => setActiveTab('certificates')}
              activeOpacity={0.8}
            >
              <Ionicons 
                className="icon-3d-rotate"
                name="ribbon-outline" 
                size={tabTextSize + 2} 
                color={activeTab === 'certificates' ? (colorScheme === 'dark' ? '#1f242d' : '#FFFFFF') : themeColors.secondaryText}
                style={{ marginRight: 6 }}
              />
              <Text 
                style={[
                  styles.tabText, 
                  { color: activeTab === 'certificates' ? (colorScheme === 'dark' ? '#1f242d' : '#FFFFFF') : themeColors.secondaryText, fontSize: tabTextSize }
                ]}
              >
                Certificates
              </Text>
            </TouchableOpacity>
          </View>

          {/* Upload Button */}
          <TouchableOpacity 
            className="btn-3d"
            style={[styles.uploadBtn, { backgroundColor: themeColors.tint, shadowColor: themeColors.tint, height: uploadBtnHeight }]}
            onPress={() => setIsUploadModalOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="cloud-upload-outline" size={uploadBtnTextSize + 4} color={colorScheme === 'dark' ? '#1f242d' : '#FFFFFF'} />
            <Text style={[styles.uploadBtnText, { color: colorScheme === 'dark' ? '#1f242d' : '#FFFFFF', fontSize: uploadBtnTextSize }]}>Add Work</Text>
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
                className="portfolio-card-3d"
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
                <View className="image-zoom-3d" style={[styles.imageContainer, { height: imageContainerHeight }]}>
                  <Image source={project.image} style={styles.projectImage} resizeMode="cover" />
                  
                  {/* Delete Button overlay */}
                  <TouchableOpacity 
                    style={styles.deleteOverlay}
                    onPress={() => handleDelete(project.id, 'project')}
                  >
                    <Ionicons className="icon-3d-rotate" name="trash" size={18} color="#EF4444" />
                  </TouchableOpacity>

                  {/* Edit Button overlay */}
                  <TouchableOpacity 
                    style={styles.editOverlay}
                    onPress={() => handleStartEdit(project, 'project')}
                  >
                    <Ionicons className="icon-3d-rotate" name="create-outline" size={18} color={themeColors.tint} />
                  </TouchableOpacity>
                </View>
                
                <View className="text-pop-3d" style={[styles.cardContent, { padding: cardPadding }]}>
                  <Text className="text-3d-hologram" style={[styles.cardTitle, { color: themeColors.text, fontSize: cardTitleSize }]} numberOfLines={1}>{project.title}</Text>
                  <Text style={[styles.cardDesc, { color: themeColors.secondaryText, fontSize: cardDescSize, lineHeight: cardDescLineHeight }]} numberOfLines={2}>{project.description}</Text>
                  
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
                        <Text style={[styles.tagText, { color: themeColors.tint, fontSize: tagTextSize }]}>{tech}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Links */}
                  <View style={styles.linksContainer}>
                    <TouchableOpacity 
                      className="btn-outline-3d"
                      style={[styles.linkButton, { borderColor: themeColors.tint, height: linkBtnHeight }]}
                      onPress={() => openLink(project.githubUrl)}
                    >
                      <Ionicons className="icon-3d-rotate" name="logo-github" size={linkTextSize} color={themeColors.tint} />
                      <Text style={[styles.linkText, { color: themeColors.tint, fontSize: linkTextSize }]}>GitHub</Text>
                    </TouchableOpacity>

                    {project.liveUrl && (
                      <TouchableOpacity 
                        className="btn-3d"
                        style={[styles.linkButton, { backgroundColor: themeColors.tint, borderColor: themeColors.tint, height: linkBtnHeight }]}
                        onPress={() => openLink(project.liveUrl!)}
                      >
                        <Text style={[styles.linkText, { color: colorScheme === 'dark' ? '#1f242d' : '#FFFFFF', fontSize: linkTextSize }]}>Live Demo</Text>
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
                className="portfolio-card-3d"
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
                  className="image-zoom-3d"
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedImage(cert.image);
                    setSelectedTitle(cert.title);
                  }}
                  style={[styles.imageBtn, { backgroundColor: themeColors.background, height: imageContainerHeight }]}
                >
                  <Image source={cert.image} style={styles.certImage} resizeMode="contain" />
                  
                  {/* Delete Button overlay */}
                  <TouchableOpacity 
                    style={styles.deleteOverlay}
                    onPress={(e: any) => {
                      if (Platform.OS === 'web' && e && e.stopPropagation) {
                        e.stopPropagation();
                      }
                      handleDelete(cert.id, 'certificate');
                    }}
                  >
                    <Ionicons className="icon-3d-rotate" name="trash" size={18} color="#EF4444" />
                  </TouchableOpacity>

                  {/* Edit Button overlay */}
                  <TouchableOpacity 
                    style={styles.editOverlay}
                    onPress={(e: any) => {
                      if (Platform.OS === 'web' && e && e.stopPropagation) {
                        e.stopPropagation();
                      }
                      handleStartEdit(cert, 'certificate');
                    }}
                  >
                    <Ionicons className="icon-3d-rotate" name="create-outline" size={18} color={themeColors.tint} />
                  </TouchableOpacity>

                  <View style={styles.zoomOverlay}>
                    <Ionicons className="icon-3d-rotate" name="scan-outline" size={imageContainerHeight > 160 ? 20 : 16} color="#FFFFFF" />
                    <Text style={[styles.zoomText, { fontSize: imageContainerHeight > 160 ? 10 : 8 }]}>View Large</Text>
                  </View>
                </TouchableOpacity>

                <View className="text-pop-3d" style={[styles.cardContent, { padding: cardPadding }]}>
                  <Text className="text-3d-hologram" style={[styles.cardTitle, { color: themeColors.text, fontSize: cardTitleSize }]} numberOfLines={1}>{cert.title}</Text>
                  <Text style={[styles.certSubtitle, { color: themeColors.secondaryText, fontSize: cardDescSize }]} numberOfLines={1}>
                    {cert.issuer} • {cert.issueDate}
                  </Text>

                  {/* Actions */}
                  <View style={styles.linksContainer}>
                    <TouchableOpacity 
                      className="btn-3d"
                      style={[styles.actionBtnPrimary, { backgroundColor: themeColors.tint, shadowColor: themeColors.tint, height: linkBtnHeight }]}
                      onPress={() => handleOpenPDF(cert.pdfUrl)}
                    >
                      <Text style={[styles.actionBtnText, { color: colorScheme === 'dark' ? '#1f242d' : '#FFFFFF', fontSize: linkTextSize }]}>View PDF</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      className="btn-outline-3d"
                      style={[styles.actionBtnSecondary, { borderColor: themeColors.border, height: linkBtnHeight }]}
                      onPress={() => {
                        setSelectedImage(cert.image);
                        setSelectedTitle(cert.title);
                      }}
                    >
                      <Text style={[styles.actionBtnTextSec, { color: themeColors.text, fontSize: linkTextSize }]}>Preview</Text>
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
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity 
            style={styles.modalCloseArea} 
            activeOpacity={1} 
            onPress={handleCloseModal}
          />
          
          <View style={[styles.uploadFormCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <View style={styles.formHeader}>
              <Text style={[styles.formTitle, { color: themeColors.text }]}>
                {editingItem ? (editingItem.type === 'project' ? 'Edit Project' : 'Edit Certificate') : 'Add New Work'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close-circle" size={28} color={themeColors.tint} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
              {/* Selector Type - Hidden in edit mode */}
              {!editingItem && (
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
              )}

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
                <Text style={[styles.inputLabel, { color: themeColors.text }]}>Picture (Screenshot / Cover Image)</Text>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: 'transparent' }}>
                  <TextInput 
                    style={[styles.textInput, { flex: 1, backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
                    placeholder="Enter Image URL or select file"
                    placeholderTextColor={themeColors.secondaryText}
                    value={newImgUrl.startsWith('data:') ? 'Local file selected (Base64 data)' : newImgUrl}
                    onChangeText={setNewImgUrl}
                  />
                  <TouchableOpacity 
                    className="btn-outline-3d"
                    style={{
                      height: 52,
                      width: 52,
                      borderRadius: 10,
                      borderWidth: 1.5,
                      borderColor: themeColors.tint,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'transparent',
                    }}
                    onPress={() => handlePickFile('image')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="image-outline" size={20} color={themeColors.tint} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* PDF Upload/Link URL for Certificates */}
              {uploadType === 'certificate' && (
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: themeColors.text }]}>Credential PDF</Text>
                  <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: 'transparent' }}>
                    <TextInput 
                      style={[styles.textInput, { flex: 1, backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
                      placeholder="Enter PDF URL or select file"
                      placeholderTextColor={themeColors.secondaryText}
                      value={newPdfUrl.startsWith('data:') ? 'Local PDF selected (Base64 data)' : newPdfUrl}
                      onChangeText={setNewPdfUrl}
                    />
                    <TouchableOpacity 
                      className="btn-outline-3d"
                      style={{
                        height: 52,
                        width: 52,
                        borderRadius: 10,
                        borderWidth: 1.5,
                        borderColor: themeColors.tint,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                      }}
                      onPress={() => handlePickFile('pdf')}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="document-text-outline" size={20} color={themeColors.tint} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Action Submit */}
              <TouchableOpacity 
                style={[styles.submitFormBtn, { backgroundColor: themeColors.tint, shadowColor: themeColors.tint }]}
                onPress={handleUploadSubmit}
                activeOpacity={0.8}
              >
                <Text style={[styles.submitFormBtnText, { color: colorScheme === 'dark' ? '#1f242d' : '#FFFFFF' }]}>
                  {editingItem ? 'Save Changes' : 'Upload Work'}
                </Text>
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
  editOverlay: {
    position: 'absolute',
    top: 12,
    left: 56,
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
