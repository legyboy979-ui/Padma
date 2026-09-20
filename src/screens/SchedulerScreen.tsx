import React, { useState } from 'react';
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
import { useLanguage } from '../context/LanguageContext';

interface SchedulerScreenProps {
  onNavigateToUpload: () => void;
}

export const SchedulerScreen: React.FC<SchedulerScreenProps> = ({ onNavigateToUpload }) => {
  const { dailySlots, removeVideoFromSlot } = useApp();
  const { t, language } = useLanguage();

  const [selectedDay, setSelectedDay] = useState(0); // 0 = Today (Sun), 1 = Mon...
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const daysOfWeek = [
    { day: 'Today', date: '20 Sep', active: true },
    { day: 'Mon', date: '21 Sep', active: false },
    { day: 'Tue', date: '22 Sep', active: false },
    { day: 'Wed', date: '23 Sep', active: false },
    { day: 'Thu', date: '24 Sep', active: false },
    { day: 'Fri', date: '25 Sep', active: false },
    { day: 'Sat', date: '26 Sep', active: false },
  ];

  const handleActionToast = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 2000);
  };

  const filledCount = dailySlots.filter((s) => s.assignedVideo).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Ionicons name="calendar" size={18} color="#06B6D4" />
        </View>
        <View>
          <Text style={styles.title}>{t('schedulerTitle')}</Text>
          <Text style={styles.sub}>{t('schedulerSubtitle')}</Text>
        </View>
      </View>

      {/* Notice alert */}
      {actionNotice && (
        <View style={styles.toastNotice}>
          <Ionicons name="information-circle" size={16} color="#38BDF8" />
          <Text style={styles.toastNoticeText}>{actionNotice}</Text>
        </View>
      )}

      {/* High-Volume 4/Daily Capacity Progress Meter */}
      <View style={styles.capacityCard}>
        <View style={styles.capacityTop}>
          <View>
            <Text style={styles.capacityTitle}>
              {language === 'hi' ? 'दैनिक क्षमता मेट्रिक्स' : 'High-Volume Daily Throughput'}
            </Text>
            <Text style={styles.capacityDesc}>
              {language === 'hi'
                ? 'न्यूनतम 4 वीडियो/दिन स्वचालित सिंडिकेशन इंजन'
                : 'Engine processes at least 4 videos daily across YT, IG & FB'}
            </Text>
          </View>
          <View style={styles.capacityPill}>
            <Ionicons name="sparkles" size={12} color="#10B981" />
            <Text style={styles.capacityPillText}>{filledCount}/4 Primed</Text>
          </View>
        </View>

        {/* 4 Slot Blocks */}
        <View style={styles.blocksRow}>
          {[0, 1, 2, 3].map((idx) => {
            const hasVideo = !!dailySlots[idx]?.assignedVideo;
            const isPublished = dailySlots[idx]?.assignedVideo?.status === 'published';
            return (
              <View
                key={idx}
                style={[
                  styles.slotBlock,
                  hasVideo && (isPublished ? styles.blockPublished : styles.blockScheduled),
                ]}
              >
                <Text
                  style={[
                    styles.blockSlotNum,
                    hasVideo && (isPublished ? styles.blockTextPublished : styles.blockTextScheduled),
                  ]}
                >
                  Slot {idx + 1}
                </Text>
                <Text style={styles.blockStatus}>
                  {hasVideo ? (isPublished ? 'LIVE' : 'QUEUED') : 'OPEN'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Upcoming Pipeline Days */}
      <View style={styles.calendarSection}>
        <Text style={styles.calendarHeading}>{t('calendarDays')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
          {daysOfWeek.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.dayCard, selectedDay === idx && styles.dayCardActive]}
              onPress={() => {
                setSelectedDay(idx);
                if (idx !== 0) {
                  handleActionToast(`Viewing pipeline queue for ${item.day}, ${item.date}`);
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.dayName, selectedDay === idx && styles.dayNameActive]}>
                {item.day}
              </Text>
              <Text style={[styles.dayDate, selectedDay === idx && styles.dayDateActive]}>
                {item.date}
              </Text>
              {idx === 0 && <View style={styles.dayActiveDot} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 4 Dedicated Daily Video Slots */}
      <View style={styles.slotsContainer}>
        <Text style={styles.sectionHeading}>
          {language === 'hi' ? "आज के 4 मुख्य समय स्लॉट्स" : "Today's 4 Prime Strategic Slots"}
        </Text>

        {dailySlots.map((slot) => {
          const video = slot.assignedVideo;
          const isPub = video?.status === 'published';

          return (
            <View key={slot.slotIndex} style={styles.slotCard}>
              {/* Slot Header */}
              <View style={styles.slotTopRow}>
                <View style={styles.slotTimeBadge}>
                  <Ionicons name="time" size={14} color="#06B6D4" />
                  <Text style={styles.slotTime}>{slot.timeStr}</Text>
                </View>

                <View style={styles.peakBadge}>
                  <Ionicons name="flame" size={12} color="#F59E0B" />
                  <Text style={styles.peakScoreText}>
                    {slot.peakReachScore}% Peak Reach
                  </Text>
                </View>

                <View
                  style={[
                    styles.statePill,
                    isPub ? styles.statePillPub : video ? styles.statePillQueued : styles.statePillEmpty,
                  ]}
                >
                  <Text
                    style={[
                      styles.stateText,
                      isPub ? styles.stateTextPub : video ? styles.stateTextQueued : styles.stateTextEmpty,
                    ]}
                  >
                    {isPub
                      ? language === 'hi' ? 'लाइव' : 'LIVE'
                      : video
                      ? language === 'hi' ? 'शेड्यूल' : 'QUEUED'
                      : language === 'hi' ? 'खाली' : 'OPEN'}
                  </Text>
                </View>
              </View>

              <Text style={styles.slotLabel}>
                {language === 'hi' ? slot.labelHi : slot.labelEn}
              </Text>

              {/* Slot Video Content */}
              {video ? (
                <View style={styles.videoDetailsCard}>
                  <Image source={{ uri: video.thumbnailUrl }} style={styles.videoThumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.videoTitle} numberOfLines={2}>
                      {video.title}
                    </Text>

                    <View style={styles.metaRow}>
                      <View style={styles.sourceTag}>
                        <Ionicons
                          name={video.source === 'gmail_harvest' ? 'mail' : 'hardware-chip'}
                          size={11}
                          color="#38BDF8"
                        />
                        <Text style={styles.sourceText}>
                          {video.source === 'gmail_harvest' ? 'Gmail Harvest' : 'OmniStudio AI'}
                        </Text>
                      </View>

                      {video.views ? (
                        <Text style={styles.viewsCounter}>
                          {video.views.toLocaleString()} views
                        </Text>
                      ) : null}
                    </View>

                    {/* Platforms */}
                    <View style={styles.platformIconsRow}>
                      <View style={styles.platBadge}>
                        <Ionicons name="logo-youtube" size={12} color="#EF4444" />
                        <Text style={styles.platBadgeText}>YT Shorts</Text>
                      </View>
                      <View style={styles.platBadge}>
                        <Ionicons name="logo-instagram" size={12} color="#E1306C" />
                        <Text style={styles.platBadgeText}>IG Reels</Text>
                      </View>
                      <View style={styles.platBadge}>
                        <Ionicons name="logo-facebook" size={12} color="#1877F2" />
                        <Text style={styles.platBadgeText}>FB Watch</Text>
                      </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.slotActionsRow}>
                      {!isPub && (
                        <TouchableOpacity
                          style={styles.actionBtnOutline}
                          onPress={() => handleActionToast(`Dispatched early release for Slot ${slot.slotIndex + 1}`)}
                        >
                          <Ionicons name="flash-outline" size={12} color="#10B981" />
                          <Text style={styles.actionBtnTextGreen}>
                            {language === 'hi' ? 'अभी पोस्ट करें' : 'Publish Now'}
                          </Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        style={styles.actionBtnOutline}
                        onPress={() => removeVideoFromSlot(slot.slotIndex)}
                      >
                        <Ionicons name="close-circle-outline" size={12} color="#F87171" />
                        <Text style={styles.actionBtnTextRed}>
                          {language === 'hi' ? 'हटाएं' : 'Unslot'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.emptySlotButton}
                  onPress={onNavigateToUpload}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add-circle" size={24} color="#06B6D4" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.emptyButtonTitle}>
                      {language === 'hi' ? 'इस स्लॉट में वीडियो जोड़ें' : 'Assign Video to this Slot'}
                    </Text>
                    <Text style={styles.emptyButtonSub}>
                      {language === 'hi'
                        ? '3 प्लेटफॉर्म पर एक साथ सिंडिकेट करने हेतु तैयार करें'
                        : 'Simultaneous YouTube, Facebook & Instagram release'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

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
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.35)',
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
  toastNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderWidth: 1,
    borderColor: '#06B6D4',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  toastNoticeText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  capacityCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  capacityTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  capacityTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  capacityDesc: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
    maxWidth: 240,
  },
  capacityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  capacityPillText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  blocksRow: {
    flexDirection: 'row',
    gap: 8,
  },
  slotBlock: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  blockPublished: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
  },
  blockScheduled: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38BDF8',
  },
  blockSlotNum: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  blockTextPublished: {
    color: '#10B981',
  },
  blockTextScheduled: {
    color: '#38BDF8',
  },
  blockStatus: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
  },
  calendarSection: {
    marginBottom: 16,
  },
  calendarHeading: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  daysScroll: {
    flexDirection: 'row',
  },
  dayCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
    minWidth: 70,
  },
  dayCardActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderColor: '#06B6D4',
  },
  dayName: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  dayNameActive: {
    color: '#06B6D4',
  },
  dayDate: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  dayDateActive: {
    color: '#F8FAFC',
  },
  dayActiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#06B6D4',
    marginTop: 4,
  },
  slotsContainer: {
    gap: 12,
  },
  sectionHeading: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  slotCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  slotTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  slotTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  slotTime: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  peakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  peakScoreText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '600',
  },
  statePill: {
    marginLeft: 'auto',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statePillPub: { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  statePillQueued: { backgroundColor: 'rgba(56, 189, 248, 0.15)' },
  statePillEmpty: { backgroundColor: '#1E293B' },
  stateText: { fontSize: 10, fontWeight: '700' },
  stateTextPub: { color: '#10B981' },
  stateTextQueued: { color: '#38BDF8' },
  stateTextEmpty: { color: '#64748B' },
  slotLabel: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 10,
  },
  videoDetailsCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  videoThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  videoTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  sourceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '600',
  },
  viewsCounter: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  platformIconsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  platBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#0F172A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  platBadgeText: {
    color: '#CBD5E1',
    fontSize: 9,
    fontWeight: '600',
  },
  slotActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionBtnTextGreen: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  actionBtnTextRed: {
    color: '#F87171',
    fontSize: 10,
    fontWeight: '600',
  },
  emptySlotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyButtonTitle: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyButtonSub: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
  },
});
