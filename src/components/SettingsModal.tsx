import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, TouchableOpacity, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Text, View } from './Themed';
import Colors from '@/constants/Colors';
import { useColorScheme, setThemeGlobal } from './useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { getIndexedDBItem, setIndexedDBItem, removeIndexedDBItem } from '@/utils/storage';
import { 
  isSupabaseConfigured, 
  clearSupabaseData,
  fetchProjectsFromSupabase,
  fetchCertificatesFromSupabase,
  deleteProjectFromSupabase,
  deleteCertificateFromSupabase,
  supabase
} from '@/utils/supabase';
import { showDeleteConfirmation, showAlert } from './DeleteConfirmation';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const [showArchiveView, setShowArchiveView] = useState(false);
  const [archivedProjects, setArchivedProjects] = useState<any[]>([]);
  const [archivedCertificates, setArchivedCertificates] = useState<any[]>([]);
  const [loadingArchived, setLoadingArchived] = useState(false);

  // Load archived items when the archive view is opened
  useEffect(() => {
    if (visible && showArchiveView) {
      const loadArchived = async () => {
        setLoadingArchived(true);
        try {
          if (isSupabaseConfigured()) {
            const dbProjects = await fetchProjectsFromSupabase();
            const dbCerts = await fetchCertificatesFromSupabase();
            setArchivedProjects(dbProjects.filter((p: any) => p.id.startsWith('archived_')));
            setArchivedCertificates(dbCerts.filter((c: any) => c.id.startsWith('archived_')));
          } else {
            if (Platform.OS === 'web') {
              const storedProjects = await getIndexedDBItem<any[]>('portfolio_projects') || [];
              const storedCerts = await getIndexedDBItem<any[]>('portfolio_certificates') || [];
              setArchivedProjects(storedProjects.filter((p: any) => p.id.startsWith('archived_')));
              setArchivedCertificates(storedCerts.filter((c: any) => c.id.startsWith('archived_')));
            }
          }
        } catch (err) {
          console.error("Failed to load archive:", err);
        } finally {
          setLoadingArchived(false);
        }
      };
      loadArchived();
    }
  }, [visible, showArchiveView]);

  const handleClose = () => {
    setShowArchiveView(false);
    onClose();
  };

  const handleRestore = async (id: string, type: 'project' | 'certificate') => {
    const newId = id.replace(/^archived_/, '');
    const title = type === 'project' ? 'Project' : 'Certificate';
    
    try {
      if (isSupabaseConfigured()) {
        const tableName = type === 'project' ? 'portfolio_projects' : 'portfolio_certificates';
        const { error } = await supabase
          .from(tableName)
          .update({ id: newId })
          .eq('id', id);
        
        if (error) throw error;
      }
      
      if (Platform.OS === 'web') {
        const storeKey = type === 'project' ? 'portfolio_projects' : 'portfolio_certificates';
        const stored = await getIndexedDBItem<any[]>(storeKey) || [];
        const updated = stored.map(item => {
          if (item.id === id) {
            return { ...item, id: newId };
          }
          return item;
        });
        await setIndexedDBItem(storeKey, updated);
        localStorage.setItem(storeKey, JSON.stringify(updated));
      }
      
      if (type === 'project') {
        setArchivedProjects(prev => prev.filter(p => p.id !== id));
      } else {
        setArchivedCertificates(prev => prev.filter(c => c.id !== id));
      }
      
      if (Platform.OS === 'web') {
        window.dispatchEvent(new Event('portfolio-data-updated'));
        showAlert({
          title: 'Restored!',
          text: `Successfully restored ${title.toLowerCase()}.`,
          isDark: colorScheme === 'dark',
          confirmButtonColor: themeColors.tint,
          icon: 'success',
        });
      } else {
        Alert.alert("Restored", `${title} restored successfully.`);
      }
    } catch (err) {
      console.error("Failed to restore item:", err);
      showAlert({
        title: 'Restore Failed',
        text: 'Could not restore the item.',
        isDark: colorScheme === 'dark',
        confirmButtonColor: themeColors.tint,
        icon: 'error',
      });
    }
  };

  const handleDeletePermanently = (id: string, type: 'project' | 'certificate') => {
    const title = type === 'project' ? 'Project' : 'Certificate';
    
    showDeleteConfirmation({
      title: `Delete ${title} Permanently`,
      text: `Are you sure you want to permanently delete this ${title.toLowerCase()}? This action cannot be undone.`,
      isDark: colorScheme === 'dark',
      onConfirm: async () => {
        try {
          if (isSupabaseConfigured()) {
            if (type === 'project') {
              await deleteProjectFromSupabase(id);
            } else {
              await deleteCertificateFromSupabase(id);
            }
          }
          
          if (Platform.OS === 'web') {
            const storeKey = type === 'project' ? 'portfolio_projects' : 'portfolio_certificates';
            const stored = await getIndexedDBItem<any[]>(storeKey) || [];
            const updated = stored.filter(item => item.id !== id);
            await setIndexedDBItem(storeKey, updated);
            localStorage.setItem(storeKey, JSON.stringify(updated));
          }
          
          if (type === 'project') {
            setArchivedProjects(prev => prev.filter(p => p.id !== id));
          } else {
            setArchivedCertificates(prev => prev.filter(c => c.id !== id));
          }

          if (Platform.OS === 'web') {
            window.dispatchEvent(new Event('portfolio-data-updated'));
          }
        } catch (err) {
          console.error("Failed to delete item permanently:", err);
          showAlert({
            title: 'Delete Failed',
            text: 'Could not delete the item permanently.',
            isDark: colorScheme === 'dark',
            confirmButtonColor: themeColors.tint,
            icon: 'error',
          });
          throw err;
        }
      }
    });
  };

  const handleResetData = () => {
    const reset = async () => {
      try {
        if (isSupabaseConfigured()) {
          await clearSupabaseData();
        }

        if (Platform.OS === 'web') {
          await removeIndexedDBItem('portfolio_projects');
          await removeIndexedDBItem('portfolio_certificates');
          localStorage.removeItem('portfolio_projects');
          localStorage.removeItem('portfolio_certificates');
          localStorage.removeItem('portfolio_resume');
          window.location.reload();
        } else {
          handleClose();
        }
      } catch (e) {
        console.error("Failed to reset portfolio data", e);
        if (Platform.OS === 'web') {
          alert("Failed to reset portfolio data: " + (e as Error).message);
        } else {
          Alert.alert("Reset Failed", "Could not clear portfolio data.");
        }
      }
    };

    if (Platform.OS === 'web') {
      const proceed = window.confirm("Are you sure you want to reset all portfolio uploads, certificates, and resumes back to defaults (this clears both local storage and Supabase database)?");
      if (proceed) reset();
    } else {
      Alert.alert(
        "Reset Data",
        "Are you sure you want to reset all data back to defaults (this clears Supabase and local settings)?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Reset", style: "destructive", onPress: reset }
        ]
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalBackground}>
        <TouchableOpacity 
          style={styles.modalCloseArea} 
          activeOpacity={1} 
          onPress={handleClose}
        />
        
        <View style={[styles.settingsCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <View style={styles.header}>
            {showArchiveView ? (
              <View style={styles.headerTitleRow}>
                <TouchableOpacity onPress={() => setShowArchiveView(false)} style={styles.backBtn} activeOpacity={0.7}>
                  <Ionicons name="arrow-back" size={24} color={themeColors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: themeColors.text }]}>Archived Items</Text>
              </View>
            ) : (
              <Text style={[styles.title, { color: themeColors.text }]}>Settings</Text>
            )}
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close-circle" size={28} color={themeColors.tint} />
            </TouchableOpacity>
          </View>

          {showArchiveView ? (
            /* Archive Manager View */
            <View style={styles.archiveContainer}>
              {loadingArchived ? (
                <View style={styles.loadingWrapper}>
                  <ActivityIndicator size="large" color={themeColors.tint} />
                  <Text style={[styles.loadingText, { color: themeColors.secondaryText }]}>Loading archived items...</Text>
                </View>
              ) : (archivedProjects.length === 0 && archivedCertificates.length === 0) ? (
                <View style={styles.emptyWrapper}>
                  <Ionicons name="archive-outline" size={48} color={themeColors.tabIconDefault} style={{ marginBottom: 12 }} />
                  <Text style={[styles.emptyText, { color: themeColors.secondaryText }]}>No archived items found</Text>
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Projects Section */}
                  {archivedProjects.length > 0 && (
                    <View style={styles.archiveSection}>
                      <Text style={[styles.sectionHeader, { color: themeColors.text }]}>Archived Projects</Text>
                      {archivedProjects.map((project) => (
                        <View key={project.id} style={[styles.archiveItem, { backgroundColor: themeColors.background, borderColor: themeColors.border }]}>
                          <Ionicons name="folder-open-outline" size={22} color={themeColors.tint} style={{ marginRight: 12 }} />
                          <View style={styles.itemInfo}>
                            <Text style={[styles.itemTitle, { color: themeColors.text }]} numberOfLines={1}>{project.title}</Text>
                            <Text style={[styles.itemSub, { color: themeColors.secondaryText }]}>Project</Text>
                          </View>
                          <View style={styles.itemActions}>
                            <TouchableOpacity 
                              style={[styles.actionBtn, { borderColor: '#10B981' }]} 
                              onPress={() => handleRestore(project.id, 'project')}
                              activeOpacity={0.7}
                            >
                              <Ionicons name="arrow-undo-outline" size={16} color="#10B981" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={[styles.actionBtn, { borderColor: '#EF4444' }]} 
                              onPress={() => handleDeletePermanently(project.id, 'project')}
                              activeOpacity={0.7}
                            >
                              <Ionicons name="trash-outline" size={16} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Certificates Section */}
                  {archivedCertificates.length > 0 && (
                    <View style={styles.archiveSection}>
                      <Text style={[styles.sectionHeader, { color: themeColors.text }]}>Archived Certificates</Text>
                      {archivedCertificates.map((cert) => (
                        <View key={cert.id} style={[styles.archiveItem, { backgroundColor: themeColors.background, borderColor: themeColors.border }]}>
                          <Ionicons name="ribbon-outline" size={22} color={themeColors.tint} style={{ marginRight: 12 }} />
                          <View style={styles.itemInfo}>
                            <Text style={[styles.itemTitle, { color: themeColors.text }]} numberOfLines={1}>{cert.title}</Text>
                            <Text style={[styles.itemSub, { color: themeColors.secondaryText }]}>{cert.issuer}</Text>
                          </View>
                          <View style={styles.itemActions}>
                            <TouchableOpacity 
                              style={[styles.actionBtn, { borderColor: '#10B981' }]} 
                              onPress={() => handleRestore(cert.id, 'certificate')}
                              activeOpacity={0.7}
                            >
                              <Ionicons name="arrow-undo-outline" size={16} color="#10B981" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={[styles.actionBtn, { borderColor: '#EF4444' }]} 
                              onPress={() => handleDeletePermanently(cert.id, 'certificate')}
                              activeOpacity={0.7}
                            >
                              <Ionicons name="trash-outline" size={16} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </ScrollView>
              )}
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
              {/* Theme Selector */}
              <View style={styles.optionGroup}>
                <Text style={[styles.optionLabel, { color: themeColors.text }]}>Choose Theme</Text>
                <View style={styles.themeRow}>
                  <TouchableOpacity 
                    className="btn-outline-3d"
                    style={[
                      styles.themeBtn, 
                      { borderColor: themeColors.border },
                      colorScheme === 'light' && { backgroundColor: themeColors.tint, borderColor: themeColors.tint }
                    ]}
                    onPress={() => setThemeGlobal('light')}
                    activeOpacity={0.8}
                  >
                    <Ionicons 
                      name="sunny-outline" 
                      size={18} 
                      color={colorScheme === 'light' ? '#FFFFFF' : themeColors.secondaryText} 
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[
                      styles.themeBtnText, 
                      { color: colorScheme === 'light' ? '#FFFFFF' : themeColors.text }
                    ]}>Light Mode</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    className="btn-3d"
                    style={[
                      styles.themeBtn, 
                      { borderColor: themeColors.border },
                      colorScheme === 'dark' && { backgroundColor: themeColors.tint, borderColor: themeColors.tint }
                    ]}
                    onPress={() => setThemeGlobal('dark')}
                    activeOpacity={0.8}
                  >
                    <Ionicons 
                      name="moon-outline" 
                      size={18} 
                      color={colorScheme === 'dark' ? '#1f242d' : themeColors.secondaryText} 
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[
                      styles.themeBtnText, 
                      { color: colorScheme === 'dark' ? '#1f242d' : themeColors.text }
                    ]}>Dark Mode</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Archive Section */}
              <View style={styles.optionGroup}>
                <Text style={[styles.optionLabel, { color: themeColors.text }]}>Portfolio Archive</Text>
                <TouchableOpacity 
                  className="btn-outline-3d"
                  style={[styles.archiveBtn, { borderColor: themeColors.tint }]}
                  onPress={() => setShowArchiveView(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="archive-outline" size={18} color={themeColors.tint} style={{ marginRight: 8 }} />
                  <Text style={[styles.archiveBtnText, { color: themeColors.text }]}>Manage Archived Items</Text>
                </TouchableOpacity>
                <Text style={[styles.helpText, { color: themeColors.secondaryText }]}>
                  View, restore, or permanently delete items you have archived from your portfolio.
                </Text>
              </View>

              {/* Version Display */}
              <View style={styles.optionGroup}>
                <Text style={[styles.optionLabel, { color: themeColors.text }]}>Project Version</Text>
                <View style={[styles.infoBox, { backgroundColor: themeColors.background, borderColor: themeColors.border }]}>
                  <Ionicons name="information-circle-outline" size={20} color={themeColors.tint} style={{ marginRight: 8 }} />
                  <Text style={[styles.infoText, { color: themeColors.secondaryText }]}>Version 1.2.0 (Premium Developer Release)</Text>
                </View>
              </View>

              {/* Reset Data Option */}
              <View style={styles.optionGroup}>
                <Text style={[styles.optionLabel, { color: themeColors.text }]}>Reset Storage Data</Text>
                <TouchableOpacity 
                  className="btn-outline-3d"
                  style={[styles.resetBtn, { borderColor: '#EF4444' }]}
                  onPress={handleResetData}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                  <Text style={styles.resetBtnText}>Reset Portfolio Data</Text>
                </TouchableOpacity>
                <Text style={[styles.helpText, { color: themeColors.secondaryText }]}>
                  Warning: This resets all custom project and certificate uploads back to the default original portfolio content.
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  settingsCard: {
    width: '90%',
    maxWidth: 480,
    maxHeight: '85%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    zIndex: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  scroll: {
    backgroundColor: 'transparent',
  },
  optionGroup: {
    backgroundColor: 'transparent',
    marginBottom: 24,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'transparent',
  },
  themeBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  themeBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  archiveBtn: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  archiveBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resetBtn: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  resetBtnText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
  helpText: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16,
  },
  archiveContainer: {
    flex: 1,
    minHeight: 250,
    maxHeight: 400,
    backgroundColor: 'transparent',
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: 'transparent',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: 'transparent',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
  },
  archiveSection: {
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  archiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'transparent',
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
