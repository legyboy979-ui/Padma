import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenSubscription?: () => void;
  onOpenSecurity?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSubscription, onOpenSecurity }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, lockApp, openBiometricScan } = useAuth();

  const isTrial = user.subscriptionPlan === 'trial';
  const planLabel = isTrial
    ? `${user.trialDaysRemaining}d ${language === 'hi' ? 'ट्रायल' : 'Trial'}`
    : user.subscriptionPlan === 'monthly_500'
    ? 'Pro ₹500'
    : user.subscriptionPlan === 'quarterly_1350'
    ? 'Saver 3M'
    : 'Free';

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <View style={styles.logoBadge}>
          <Ionicons name="infinite" size={22} color="#8B5CF6" />
        </View>
        <View>
          <View style={styles.brandTitleRow}>
            <Text style={styles.brandTitle}>OmniStream</Text>
            <View style={styles.aiTag}>
              <Text style={styles.aiTagText}>AI</Text>
            </View>
          </View>
          <Text style={styles.brandSub}>
            {language === 'hi' ? 'ऑटोनॉमस सिंडिकेशन' : 'Autonomous Engine'}
          </Text>
        </View>
      </View>

      <View style={styles.rightRow}>
        {/* Subscription / Trial Badge */}
        <TouchableOpacity
          style={[styles.planPill, isTrial ? styles.trialPill : styles.proPill]}
          onPress={onOpenSubscription}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isTrial ? 'time-outline' : 'sparkles'}
            size={13}
            color={isTrial ? '#F59E0B' : '#10B981'}
          />
          <Text style={[styles.planPillText, isTrial ? styles.trialPillText : styles.proPillText]}>
            {planLabel}
          </Text>
        </TouchableOpacity>

        {/* Language Switcher */}
        <TouchableOpacity
          style={styles.langButton}
          onPress={toggleLanguage}
          activeOpacity={0.7}
        >
          <Ionicons name="globe-outline" size={15} color="#94A3B8" />
          <Text style={styles.langText}>{language === 'en' ? 'हिन्दी' : 'EN'}</Text>
        </TouchableOpacity>

        {/* Biometric / Lock Quick Trigger */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => openBiometricScan()}
          activeOpacity={0.7}
        >
          <Ionicons name="scan-outline" size={17} color="#06B6D4" />
        </TouchableOpacity>

        {/* User Avatar */}
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={onOpenSecurity}
          activeOpacity={0.8}
        >
          <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
          <View style={styles.onlineDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0A0D14',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  aiTag: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  aiTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandSub: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  trialPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  trialPillText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },
  proPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  proPillText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  langText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: {
    position: 'relative',
  },
  avatarImg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#0A0D14',
  },
});
