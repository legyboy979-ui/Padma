import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Contexts
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';

// Components
import { Header } from './src/components/Header';
import { BiometricModal } from './src/components/BiometricModal';
import { PasscodeModal } from './src/components/PasscodeModal';
import { OtpModal } from './src/components/OtpModal';
import { SubscriptionModal } from './src/components/SubscriptionModal';
import { AiOptimizerModal } from './src/components/AiOptimizerModal';
import { WithdrawModal } from './src/components/WithdrawModal';
import { InviteMemberModal } from './src/components/InviteMemberModal';
import { ArchitectureModal } from './src/components/ArchitectureModal';

// Screens
import { DashboardScreen } from './src/screens/DashboardScreen';
import { UploadScreen } from './src/screens/UploadScreen';
import { SchedulerScreen } from './src/screens/SchedulerScreen';
import { HarvestScreen } from './src/screens/HarvestScreen';
import { CollaborationScreen } from './src/screens/CollaborationScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

function MainApp() {
  const { t, language } = useLanguage();
  const { isLocked, openBiometricScan, openPasscodeModal } = useAuth();

  const [activeTab, setActiveTab] = useState(0); // 0: Dash, 1: Upload, 2: Sched, 3: Harvest, 4: Team, 5: Wallet, 6: Settings

  // Modals visibility
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isAiStudioOpen, setIsAiStudioOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  // Transfer data generated in AI Studio into Upload form
  const [aiAppliedData, setAiAppliedData] = useState<{
    title: string;
    description: string;
    hashtags: string[];
  } | null>(null);

  const tabs = [
    { id: 0, label: t('tabDashboard'), icon: 'grid', activeIcon: 'grid' },
    { id: 1, label: t('tabUpload'), icon: 'cloud-upload-outline', activeIcon: 'cloud-upload' },
    { id: 2, label: t('tabScheduler'), icon: 'calendar-outline', activeIcon: 'calendar' },
    { id: 3, label: t('tabHarvest'), icon: 'mail-outline', activeIcon: 'mail' },
    { id: 4, label: t('tabTeam'), icon: 'people-outline', activeIcon: 'people' },
    { id: 5, label: t('tabWallet'), icon: 'wallet-outline', activeIcon: 'wallet' },
  ];

  const handleAiApply = (data: { title: string; description: string; hashtags: string[] }) => {
    setAiAppliedData(data);
    setActiveTab(1); // Switch to Upload tab
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Header */}
        <Header
          onOpenSubscription={() => setIsSubscriptionOpen(true)}
          onOpenSecurity={() => setActiveTab(6)} // Settings & Security
        />

        {/* Lock Screen Shield Overlay if App is locked */}
        {isLocked ? (
          <View style={styles.lockedContainer}>
            <View style={styles.lockShieldIcon}>
              <Ionicons name="lock-closed" size={48} color="#8B5CF6" />
            </View>
            <Text style={styles.lockedTitle}>
              {language === 'hi' ? 'ओमनीस्ट्रीम AI लॉक है' : 'OmniStream AI is Locked'}
            </Text>
            <Text style={styles.lockedSub}>
              {language === 'hi'
                ? 'सिस्टम एक्सेस करने के लिए बायोमेट्रिक फेस आईडी या पिन से अनलॉक करें'
                : 'Authenticate via Hardware Face Biometrics or 6-digit PIN'}
            </Text>
            <View style={styles.lockedActionsRow}>
              <TouchableOpacity
                style={styles.unlockBiometricBtn}
                onPress={() => openBiometricScan()}
                activeOpacity={0.8}
              >
                <Ionicons name="scan" size={20} color="#FFFFFF" />
                <Text style={styles.unlockBiometricText}>
                  {language === 'hi' ? 'चेहरा स्कैन करें' : 'Unlock with Face ID'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.unlockPasscodeBtn}
                onPress={() => openPasscodeModal('verify')}
                activeOpacity={0.8}
              >
                <Ionicons name="keypad" size={18} color="#CBD5E1" />
                <Text style={styles.unlockPasscodeText}>
                  {language === 'hi' ? 'पासकोड पिन' : 'Enter Passcode'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.screenBody}>
            {/* Active Screen Rendering */}
            {activeTab === 0 && (
              <DashboardScreen
                onNavigateTab={(idx) => setActiveTab(idx)}
                onOpenSubscription={() => setIsSubscriptionOpen(true)}
                onOpenAiStudio={() => setIsAiStudioOpen(true)}
                onOpenWithdraw={() => setIsWithdrawOpen(true)}
              />
            )}
            {activeTab === 1 && (
              <UploadScreen
                onOpenAiStudio={() => setIsAiStudioOpen(true)}
                aiAppliedData={aiAppliedData}
                onClearAiAppliedData={() => setAiAppliedData(null)}
              />
            )}
            {activeTab === 2 && (
              <SchedulerScreen onNavigateToUpload={() => setActiveTab(1)} />
            )}
            {activeTab === 3 && <HarvestScreen />}
            {activeTab === 4 && (
              <CollaborationScreen onOpenInviteModal={() => setIsInviteOpen(true)} />
            )}
            {activeTab === 5 && (
              <WalletScreen onOpenWithdrawModal={() => setIsWithdrawOpen(true)} />
            )}
            {activeTab === 6 && (
              <SettingsScreen
                onOpenSubscription={() => setIsSubscriptionOpen(true)}
                onOpenArchitecture={() => setIsArchitectureOpen(true)}
              />
            )}
          </View>
        )}

        {/* Global Bottom Tab Bar (shown when unlocked) */}
        {!isLocked && (
          <View style={styles.bottomBar}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={styles.tabButton}
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.tabIconWrap, isActive && styles.tabIconActiveWrap]}>
                    <Ionicons
                      name={(isActive ? tab.activeIcon : tab.icon) as any}
                      size={20}
                      color={isActive ? '#8B5CF6' : '#64748B'}
                    />
                  </View>
                  <Text
                    style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Quick 7th Tab for Security & Docs */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setActiveTab(6)}
              activeOpacity={0.7}
            >
              <View style={[styles.tabIconWrap, activeTab === 6 && styles.tabIconActiveWrap]}>
                <Ionicons
                  name={activeTab === 6 ? 'shield-checkmark' : 'shield-outline'}
                  size={20}
                  color={activeTab === 6 ? '#06B6D4' : '#64748B'}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 6 && { color: '#06B6D4', fontWeight: '700' },
                ]}
                numberOfLines={1}
              >
                {t('tabSettings')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* All Global Modals */}
        <BiometricModal />
        <PasscodeModal />
        <OtpModal />
        <SubscriptionModal
          visible={isSubscriptionOpen}
          onClose={() => setIsSubscriptionOpen(false)}
        />
        <AiOptimizerModal
          visible={isAiStudioOpen}
          onClose={() => setIsAiStudioOpen(false)}
          onApply={handleAiApply}
        />
        <WithdrawModal
          visible={isWithdrawOpen}
          onClose={() => setIsWithdrawOpen(false)}
        />
        <InviteMemberModal
          visible={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
        />
        <ArchitectureModal
          visible={isArchitectureOpen}
          onClose={() => setIsArchitectureOpen(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...MaterialCommunityIcons.font,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <MainApp />
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0D14',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A0D14',
  },
  screenBody: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#0A0D14',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconActiveWrap: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  tabLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#8B5CF6',
    fontWeight: '700',
  },
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  lockShieldIcon: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  lockedTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
  },
  lockedSub: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    maxWidth: 320,
    marginBottom: 24,
  },
  lockedActionsRow: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  unlockBiometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 14,
  },
  unlockBiometricText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  unlockPasscodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  unlockPasscodeText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
});
