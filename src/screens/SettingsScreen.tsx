import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface SettingsScreenProps {
  onOpenSubscription: () => void;
  onOpenArchitecture: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onOpenSubscription,
  onOpenArchitecture,
}) => {
  const {
    user,
    openBiometricScan,
    openPasscodeModal,
    openOtpVerification,
    toggleMfa,
    toggleBiometrics,
    lockApp,
  } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Ionicons name="shield-checkmark" size={18} color="#8B5CF6" />
        </View>
        <View>
          <Text style={styles.title}>{t('securityTitle')}</Text>
          <Text style={styles.sub}>{t('securitySubtitle')}</Text>
        </View>
      </View>

      {/* User Profile Card */}
      <View style={styles.profileCard}>
        <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
        <View style={{ flex: 1 }}>
          <View style={styles.profileNameRow}>
            <Text style={styles.profileName}>{user.name}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{user.role.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <Text style={styles.profilePhone}>{user.phone}</Text>
        </View>

        <TouchableOpacity
          style={styles.reVerifyOtpBtn}
          onPress={() => openOtpVerification(user.phone)}
          activeOpacity={0.8}
        >
          <Ionicons name="shield-checkmark" size={13} color="#38BDF8" />
          <Text style={styles.reVerifyOtpText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>

      {/* Subscription & Freemium Tier Status */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>{t('subscriptionTitle')}</Text>

        <View style={styles.subStatusRow}>
          <View style={styles.subBadgeWrap}>
            <Ionicons name="sparkles" size={18} color="#F59E0B" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.subStatusTitle}>
              {user.subscriptionPlan === 'trial'
                ? `7-Day Free Trial (${user.trialDaysRemaining} days left)`
                : user.subscriptionPlan === 'monthly_500'
                ? 'Monthly Pro (₹500 / month)'
                : 'Quarterly Saver (₹1,350 / 3 months)'}
            </Text>
            <Text style={styles.subStatusDesc}>
              {language === 'hi'
                ? 'असीमित मल्टी-प्लेटफ़ॉर्म अपलोड, 4+ दैनिक स्लॉट और AI हुक टूल्स'
                : 'Unlimited simultaneous syndication, 4+ daily engine, AI studio'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.upgradeBtn}
          onPress={onOpenSubscription}
          activeOpacity={0.8}
        >
          <Ionicons name="card-outline" size={15} color="#FFFFFF" />
          <Text style={styles.upgradeBtnText}>
            {language === 'hi' ? 'प्लान बदलें / अपग्रेड करें' : 'Change Plan / Upgrade Subscription'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Biometrics & Hardware Security */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Biometrics & Security Authentication</Text>

        {/* Face Scan Trigger */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => openBiometricScan()}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconBox}>
            <Ionicons name="scan" size={18} color="#06B6D4" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>{t('faceScanTitle')}</Text>
            <Text style={styles.actionDesc}>{t('faceScanDesc')}</Text>
          </View>
          <View style={styles.testBtn}>
            <Text style={styles.testBtnText}>Test Face ID</Text>
          </View>
        </TouchableOpacity>

        {/* Biometrics toggle */}
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Enable Biometric Quick-Unlock</Text>
            <Text style={styles.toggleDesc}>
              Authenticate publishing dispatches & payouts with Face ID
            </Text>
          </View>
          <Switch
            value={user.biometricEnabled}
            onValueChange={toggleBiometrics}
            trackColor={{ false: '#334155', true: '#06B6D4' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Passcode (PIN) */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => openPasscodeModal('verify')}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconBox}>
            <Ionicons name="keypad" size={18} color="#8B5CF6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>{t('passcodeTitle')}</Text>
            <Text style={styles.actionDesc}>PIN: •••••• (Customizable 6-digit access code)</Text>
          </View>
          <TouchableOpacity
            style={styles.changePasscodePill}
            onPress={() => openPasscodeModal('set')}
          >
            <Text style={styles.changePasscodeText}>{t('changePasscodeBtn')}</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* MFA Setting */}
        <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>{t('mfaStatus')}</Text>
            <Text style={styles.toggleDesc}>{t('mfaActive')}</Text>
          </View>
          <Switch
            value={user.mfaEnabled}
            onValueChange={toggleMfa}
            trackColor={{ false: '#334155', true: '#10B981' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Language Switching Setting */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>{t('languageSwitch')}</Text>

        <View style={styles.langChoicesRow}>
          <TouchableOpacity
            style={[styles.langChoiceBtn, language === 'en' && styles.langChoiceBtnActive]}
            onPress={() => setLanguage('en')}
            activeOpacity={0.8}
          >
            <Ionicons
              name={language === 'en' ? 'checkmark-circle' : 'ellipse-outline'}
              size={18}
              color={language === 'en' ? '#8B5CF6' : '#64748B'}
            />
            <Text style={[styles.langChoiceText, language === 'en' && styles.langChoiceTextActive]}>
              English (US)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langChoiceBtn, language === 'hi' && styles.langChoiceBtnActive]}
            onPress={() => setLanguage('hi')}
            activeOpacity={0.8}
          >
            <Ionicons
              name={language === 'hi' ? 'checkmark-circle' : 'ellipse-outline'}
              size={18}
              color={language === 'hi' ? '#8B5CF6' : '#64748B'}
            />
            <Text style={[styles.langChoiceText, language === 'hi' && styles.langChoiceTextActive]}>
              हिंदी (Hindi)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Architecture & GitHub Documentation Spec */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>{t('architectureTitle')}</Text>
        <Text style={styles.archDesc}>{t('architectureSubtitle')}</Text>

        <TouchableOpacity
          style={styles.archBtn}
          onPress={onOpenArchitecture}
          activeOpacity={0.8}
        >
          <Ionicons name="git-branch" size={16} color="#FFFFFF" />
          <Text style={styles.archBtnText}>{t('viewDocs')}</Text>
          <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Immediate App Lock */}
      <TouchableOpacity
        style={styles.lockAppBtn}
        onPress={() => {
          lockApp();
          openBiometricScan();
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="lock-closed" size={15} color="#94A3B8" />
        <Text style={styles.lockAppText}>
          {language === 'hi' ? 'ऐप अभी लॉक करें (सुरक्षा हेतु)' : 'Lock Application (Security Test)'}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  headerBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  sub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  roleBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  roleBadgeText: {
    color: '#F59E0B',
    fontSize: 9,
    fontWeight: '800',
  },
  profileEmail: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
  },
  profilePhone: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 1,
  },
  reVerifyOtpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  reVerifyOtpText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  cardLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  subStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  subBadgeWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subStatusTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  subStatusDesc: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 12,
  },
  upgradeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  actionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  actionDesc: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 1,
  },
  testBtn: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  testBtnText: {
    color: '#06B6D4',
    fontSize: 11,
    fontWeight: '700',
  },
  changePasscodePill: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  changePasscodeText: {
    color: '#A78BFA',
    fontSize: 11,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  toggleTitle: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  toggleDesc: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
    maxWidth: 240,
  },
  langChoicesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  langChoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  langChoiceBtnActive: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
  },
  langChoiceText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  langChoiceTextActive: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  archDesc: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 12,
  },
  archBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#06B6D4',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  archBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  lockAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 14,
  },
  lockAppText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
});
