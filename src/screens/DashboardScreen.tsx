import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface DashboardScreenProps {
  onNavigateTab: (tabIndex: number) => void;
  onOpenSubscription: () => void;
  onOpenAiStudio: () => void;
  onOpenWithdraw: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateTab,
  onOpenSubscription,
  onOpenAiStudio,
  onOpenWithdraw,
}) => {
  const { user } = useAuth();
  const { dailySlots, socialAccounts, auditLogs, triggerGmailSweep, isHarvesting } = useApp();
  const { t, language } = useLanguage();

  const filledSlotsCount = dailySlots.filter((s) => s.assignedVideo).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome & Overview Header */}
      <View style={styles.heroSection}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.welcomeSub}>
              {t('welcomeBack')} {user.name.split(' ')[0]} 👋
            </Text>
            <Text style={styles.heroTitle}>{t('overviewTitle')}</Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>3 APIs Active</Text>
          </View>
        </View>

        {/* 7-Day Trial / Subscription Banner */}
        <TouchableOpacity
          style={styles.trialBanner}
          onPress={onOpenSubscription}
          activeOpacity={0.85}
        >
          <View style={styles.trialIconWrap}>
            <Ionicons name="sparkles" size={20} color="#F59E0B" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.trialTitleRow}>
              <Text style={styles.trialTitle}>
                {user.subscriptionPlan === 'trial'
                  ? `${user.trialDaysRemaining} ${language === 'hi' ? 'दिन प्रो ट्रायल शेष' : 'Days Pro Trial Active'}`
                  : user.subscriptionPlan === 'monthly_500'
                  ? 'Monthly Pro Plan (₹500/mo)'
                  : 'Quarterly Saver (3 Months)'}
              </Text>
              <Text style={styles.upgradeText}>{t('upgradeToPro')} →</Text>
            </View>
            <Text style={styles.trialDesc}>
              {language === 'hi'
                ? 'यूट्यूब, फेसबुक और इंस्टाग्राम पर 4+ दैनिक वीडियो ऑटो-सिंडिकेशन सक्रिय है।'
                : 'Simultaneous YouTube, FB & IG syndication with 4+ daily engine.'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Key Metrics Cards */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={styles.metricIconBox}>
              <Ionicons name="eye-outline" size={17} color="#38BDF8" />
            </View>
            <Text style={styles.metricValue}>1.28M</Text>
            <Text style={styles.metricLabel}>{t('totalViews')}</Text>
            <View style={styles.growthBadge}>
              <Ionicons name="trending-up" size={11} color="#10B981" />
              <Text style={styles.growthText}>+38.4%</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="calendar-outline" size={17} color="#10B981" />
            </View>
            <Text style={styles.metricValue}>{filledSlotsCount}/4</Text>
            <Text style={styles.metricLabel}>
              {language === 'hi' ? 'आज के स्लॉट' : 'Daily Slots'}
            </Text>
            <View style={[styles.growthBadge, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
              <Text style={styles.growthText}>100% Filled</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <Ionicons name="wallet-outline" size={17} color="#8B5CF6" />
            </View>
            <Text style={styles.metricValue}>₹{Math.round(user.walletBalanceINR / 1000)}k</Text>
            <Text style={styles.metricLabel}>{t('availableBalance')}</Text>
            <TouchableOpacity onPress={onOpenWithdraw}>
              <Text style={styles.miniWithdraw}>Payout →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Operations Strip */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('quickActions')}</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => onNavigateTab(1)} // Upload Tab
            activeOpacity={0.8}
          >
            <View style={[styles.qaIcon, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
              <Ionicons name="cloud-upload" size={18} color="#A78BFA" />
            </View>
            <Text style={styles.qaTitle}>{t('actionUpload')}</Text>
            <Text style={styles.qaDesc}>YT, IG & FB</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={onOpenAiStudio}
            activeOpacity={0.8}
          >
            <View style={[styles.qaIcon, { backgroundColor: 'rgba(6, 182, 212, 0.2)' }]}>
              <Ionicons name="sparkles" size={18} color="#06B6D4" />
            </View>
            <Text style={styles.qaTitle}>{t('actionAiStudio')}</Text>
            <Text style={styles.qaDesc}>Hooks & Tags</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => triggerGmailSweep()}
            disabled={isHarvesting}
            activeOpacity={0.8}
          >
            <View style={[styles.qaIcon, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
              <Ionicons
                name={isHarvesting ? 'refresh' : 'mail'}
                size={18}
                color="#F87171"
              />
            </View>
            <Text style={styles.qaTitle}>
              {isHarvesting ? 'Scanning...' : t('actionHarvest')}
            </Text>
            <Text style={styles.qaDesc}>Gmail Daemon</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={onOpenWithdraw}
            activeOpacity={0.8}
          >
            <View style={[styles.qaIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
              <Ionicons name="cash" size={18} color="#10B981" />
            </View>
            <Text style={styles.qaTitle}>{t('actionWithdraw')}</Text>
            <Text style={styles.qaDesc}>Instant UPI</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Today's 4-Slot Automation Pipeline */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>{t('todayQueue')}</Text>
            <Text style={styles.sectionSubtitle}>{t('dailyEngineStatus')}</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigateTab(2)}>
            <Text style={styles.viewAllText}>
              {language === 'hi' ? 'शेड्यूलर देखें →' : 'Manage Slots →'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.slotsCard}>
          {dailySlots.map((slot, idx) => {
            const video = slot.assignedVideo;
            return (
              <View
                key={slot.slotIndex}
                style={[styles.slotRow, idx < dailySlots.length - 1 && styles.slotRowBorder]}
              >
                {/* Time Badge */}
                <View style={styles.slotTimeCol}>
                  <Text style={styles.slotTimeText}>{slot.timeStr}</Text>
                  <View style={styles.reachPill}>
                    <Ionicons name="flame" size={10} color="#F59E0B" />
                    <Text style={styles.reachScore}>{slot.peakReachScore}% Reach</Text>
                  </View>
                </View>

                {/* Video Info or Empty */}
                {video ? (
                  <View style={styles.slotVideoContent}>
                    <Image source={{ uri: video.thumbnailUrl }} style={styles.slotThumb} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.slotVideoTitle} numberOfLines={1}>
                        {video.title}
                      </Text>
                      <View style={styles.slotPlatformRow}>
                        <View style={styles.platPill}>
                          <Ionicons name="logo-youtube" size={11} color="#EF4444" />
                          <Text style={styles.platText}>YT</Text>
                        </View>
                        <View style={styles.platPill}>
                          <Ionicons name="logo-instagram" size={11} color="#E1306C" />
                          <Text style={styles.platText}>IG</Text>
                        </View>
                        <View style={styles.platPill}>
                          <Ionicons name="logo-facebook" size={11} color="#1877F2" />
                          <Text style={styles.platText}>FB</Text>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            video.status === 'published' ? styles.pubBadge : styles.schBadge,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              video.status === 'published' ? styles.pubText : styles.schText,
                            ]}
                          >
                            {video.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.emptySlotBox}
                    onPress={() => onNavigateTab(1)}
                  >
                    <Ionicons name="add-circle-outline" size={18} color="#64748B" />
                    <Text style={styles.emptySlotText}>Slot Open • Tap to Upload & Queue</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Connected Channels Health */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('channelHealth')}</Text>
        {socialAccounts.map((channel) => (
          <View key={channel.platform} style={styles.channelCard}>
            <View style={styles.channelLeft}>
              <View
                style={[
                  styles.channelIconBox,
                  channel.platform === 'youtube' && { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
                  channel.platform === 'instagram' && { backgroundColor: 'rgba(225, 48, 108, 0.15)' },
                  channel.platform === 'facebook' && { backgroundColor: 'rgba(24, 119, 242, 0.15)' },
                ]}
              >
                <Ionicons
                  name={
                    channel.platform === 'youtube'
                      ? 'logo-youtube'
                      : channel.platform === 'instagram'
                      ? 'logo-instagram'
                      : 'logo-facebook'
                  }
                  size={20}
                  color={
                    channel.platform === 'youtube'
                      ? '#EF4444'
                      : channel.platform === 'instagram'
                      ? '#E1306C'
                      : '#1877F2'
                  }
                />
              </View>
              <View>
                <Text style={styles.channelName}>{channel.name}</Text>
                <Text style={styles.channelHandle}>{channel.handle}</Text>
                <Text style={styles.channelProtocol}>{channel.apiProtocol}</Text>
              </View>
            </View>

            <View style={styles.channelRight}>
              <View style={styles.tokenPill}>
                <View style={styles.tokenDot} />
                <Text style={styles.tokenText}>{channel.tokenExpiresIn}</Text>
              </View>
              <Text style={styles.subCount}>{channel.subscribers}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Activity Audit Stream */}
      <View style={[styles.section, { paddingBottom: 40 }]}>
        <Text style={styles.sectionTitle}>{t('recentActivity')}</Text>
        <View style={styles.auditCard}>
          {auditLogs.slice(0, 4).map((log, idx) => (
            <View
              key={log.id}
              style={[styles.auditRow, idx < 3 && styles.auditRowBorder]}
            >
              <View style={styles.auditIcon}>
                <Ionicons name="flash-outline" size={13} color="#8B5CF6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.auditAction}>{log.action}</Text>
                <Text style={styles.auditDetail} numberOfLines={1}>
                  {log.detail}
                </Text>
                <View style={styles.auditMeta}>
                  <Text style={styles.auditUser}>{log.user}</Text>
                  <Text style={styles.auditTime}>• {log.timestamp}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14',
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  welcomeSub: {
    color: '#94A3B8',
    fontSize: 13,
  },
  heroTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    padding: 12,
    marginBottom: 16,
  },
  trialIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trialTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trialTitle: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '700',
  },
  upgradeText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  trialDesc: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  metricIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricValue: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  metricLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  growthText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  miniWithdraw: {
    color: '#A78BFA',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  sectionSubtitle: {
    color: '#64748B',
    fontSize: 11,
    marginTop: -8,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  viewAllText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  qaIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  qaTitle: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  qaDesc: {
    color: '#64748B',
    fontSize: 9,
    marginTop: 2,
  },
  slotsCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    overflow: 'hidden',
  },
  slotRow: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    gap: 12,
  },
  slotRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  slotTimeCol: {
    width: 82,
  },
  slotTimeText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  reachPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  reachScore: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '600',
  },
  slotVideoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  slotThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  slotVideoTitle: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  slotPlatformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  platPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#1E293B',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  platText: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  pubBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  schBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  pubText: {
    color: '#10B981',
  },
  schText: {
    color: '#38BDF8',
  },
  emptySlotBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptySlotText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 8,
  },
  channelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  channelIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  channelHandle: {
    color: '#64748B',
    fontSize: 11,
  },
  channelProtocol: {
    color: '#06B6D4',
    fontSize: 9,
    marginTop: 2,
  },
  channelRight: {
    alignItems: 'flex-end',
  },
  tokenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  tokenDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  tokenText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '600',
  },
  subCount: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
  auditCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
  },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
  },
  auditRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  auditIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  auditAction: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  auditDetail: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
  },
  auditMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  auditUser: {
    color: '#64748B',
    fontSize: 10,
  },
  auditTime: {
    color: '#475569',
    fontSize: 10,
  },
});
