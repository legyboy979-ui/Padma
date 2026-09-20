import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Switch,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { samplePresetClips } from '../data/mockData';
import { PlatformConfig } from '../types';

interface UploadScreenProps {
  onOpenAiStudio: () => void;
  aiAppliedData?: { title: string; description: string; hashtags: string[] } | null;
  onClearAiAppliedData?: () => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  onOpenAiStudio,
  aiAppliedData,
  onClearAiAppliedData,
}) => {
  const { uploadSimultaneously, isUploading, uploadProgress, uploadStatusStep } = useApp();
  const { t, language } = useLanguage();

  const [selectedClip, setSelectedClip] = useState(samplePresetClips[0]);
  const [videoTitle, setVideoTitle] = useState(samplePresetClips[0].title);
  const [videoDesc, setVideoDesc] = useState(samplePresetClips[0].desc);
  const [hashtagsStr, setHashtagsStr] = useState(samplePresetClips[0].tags.join(' '));

  const [platforms, setPlatforms] = useState<PlatformConfig>({
    youtube: true,
    instagram: true,
    facebook: true,
  });

  const [immediatePublish, setImmediatePublish] = useState(true);
  const [assignedSlotIdx, setAssignedSlotIdx] = useState(0);
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState(false);

  // Sync when AI optimizer passes data
  React.useEffect(() => {
    if (aiAppliedData) {
      if (aiAppliedData.title) setVideoTitle(aiAppliedData.title);
      if (aiAppliedData.description) setVideoDesc(aiAppliedData.description);
      if (aiAppliedData.hashtags) setHashtagsStr(aiAppliedData.hashtags.join(' '));
      if (onClearAiAppliedData) onClearAiAppliedData();
    }
  }, [aiAppliedData]);

  const handleSelectClip = (clip: typeof samplePresetClips[0]) => {
    setSelectedClip(clip);
    setVideoTitle(clip.title);
    setVideoDesc(clip.desc);
    setHashtagsStr(clip.tags.join(' '));
  };

  const handleStartUpload = () => {
    const tagsArray = hashtagsStr
      .split(' ')
      .map((t) => t.trim())
      .filter((t) => t.startsWith('#') || t.length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    uploadSimultaneously(
      {
        title: videoTitle.trim() || selectedClip.title,
        description: videoDesc.trim() || selectedClip.desc,
        hashtags: tagsArray,
        thumbnailUrl: selectedClip.thumbnail,
        platforms,
        slotIndex: assignedSlotIdx,
        immediatePublish,
      },
      () => {
        setUploadSuccessAlert(true);
        setTimeout(() => setUploadSuccessAlert(false), 2500);
      }
    );
  };

  const togglePlatform = (p: keyof PlatformConfig) => {
    setPlatforms((prev) => ({ ...prev, [p]: !prev[p] }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Screen Title */}
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Ionicons name="cloud-upload" size={18} color="#8B5CF6" />
        </View>
        <View>
          <Text style={styles.title}>{t('uploadTitle')}</Text>
          <Text style={styles.sub}>{t('uploadSubtitle')}</Text>
        </View>
      </View>

      {/* Uploading Progress Overlay Bar */}
      {isUploading && (
        <View style={styles.uploadProgressCard}>
          <View style={styles.uploadProgressTop}>
            <View style={styles.uploadStatusLeft}>
              <ActivityIndicator color="#8B5CF6" size="small" />
              <Text style={styles.uploadStatusStep}>{uploadStatusStep}</Text>
            </View>
            <Text style={styles.uploadPercent}>{uploadProgress}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${uploadProgress}%` }]} />
          </View>
        </View>
      )}

      {/* Success Banner */}
      {uploadSuccessAlert && (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-done-circle" size={22} color="#10B981" />
          <View style={{ flex: 1 }}>
            <Text style={styles.successTitle}>
              {language === 'hi' ? 'सफलतापूर्वक सिंडिकेट हुआ!' : 'Simultaneous Syndication Dispatched!'}
            </Text>
            <Text style={styles.successDesc}>
              {language === 'hi'
                ? 'वीडियो यूट्यूब, फेसबुक और इंस्टाग्राम पर लाइव हो गया है।'
                : 'Pushed to YouTube v3, Meta Graph IG Reels, & FB Watch.'}
            </Text>
          </View>
        </View>
      )}

      {/* Choose Video Source */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardLabel}>{t('sampleClips')}</Text>
          <View style={styles.clipDurationBadge}>
            <Ionicons name="videocam" size={12} color="#38BDF8" />
            <Text style={styles.clipDurationText}>4K 60fps Ready</Text>
          </View>
        </View>

        {/* Horizontal preset clips picker */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clipScroll}>
          {samplePresetClips.map((clip) => {
            const isSelected = selectedClip.id === clip.id;
            return (
              <TouchableOpacity
                key={clip.id}
                style={[styles.clipCard, isSelected && styles.clipCardSelected]}
                onPress={() => handleSelectClip(clip)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: clip.thumbnail }} style={styles.clipThumb} />
                <View style={styles.clipDurationPill}>
                  <Text style={styles.clipDurationVal}>{clip.duration}</Text>
                </View>
                {isSelected && (
                  <View style={styles.clipSelectedCheck}>
                    <Ionicons name="checkmark-circle" size={18} color="#8B5CF6" />
                  </View>
                )}
                <Text style={styles.clipTitle} numberOfLines={2}>
                  {clip.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* OmniPrompt AI Assistant Trigger Banner */}
      <TouchableOpacity
        style={styles.aiBanner}
        onPress={onOpenAiStudio}
        activeOpacity={0.85}
      >
        <View style={styles.aiIconWrap}>
          <Ionicons name="sparkles" size={22} color="#8B5CF6" />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.aiBadgeRow}>
            <Text style={styles.aiBannerTitle}>{t('aiGenerateBtn')}</Text>
            <View style={styles.neuralPill}>
              <Text style={styles.neuralText}>v4.2 Model</Text>
            </View>
          </View>
          <Text style={styles.aiBannerSub}>{t('aiGenerateSubtitle')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#A78BFA" />
      </TouchableOpacity>

      {/* Title & Description Form */}
      <View style={styles.card}>
        <Text style={styles.inputLabel}>{t('videoTitleLabel')}</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.textInput}
            value={videoTitle}
            onChangeText={setVideoTitle}
            placeholder={t('videoTitlePlaceholder')}
            placeholderTextColor="#64748B"
          />
        </View>

        <Text style={[styles.inputLabel, { marginTop: 12 }]}>{t('videoDescLabel')}</Text>
        <View style={[styles.inputBox, { height: 90 }]}>
          <TextInput
            style={[styles.textInput, { height: '100%' }]}
            value={videoDesc}
            onChangeText={setVideoDesc}
            placeholder={t('videoDescPlaceholder')}
            placeholderTextColor="#64748B"
            multiline
          />
        </View>

        <Text style={[styles.inputLabel, { marginTop: 12 }]}>{t('hashtagsLabel')}</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.textInput}
            value={hashtagsStr}
            onChangeText={setHashtagsStr}
            placeholder={t('hashtagsPlaceholder')}
            placeholderTextColor="#64748B"
          />
        </View>
      </View>

      {/* Target Platforms Toggles */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>{t('targetPlatforms')}</Text>

        {/* YouTube */}
        <View style={styles.platformRow}>
          <View style={styles.platLeft}>
            <View style={[styles.platIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Ionicons name="logo-youtube" size={18} color="#EF4444" />
            </View>
            <View>
              <Text style={styles.platTitle}>{t('youtubeShorts')}</Text>
              <Text style={styles.platMeta}>Resumable Direct Ingest API v3</Text>
            </View>
          </View>
          <Switch
            value={platforms.youtube}
            onValueChange={() => togglePlatform('youtube')}
            trackColor={{ false: '#334155', true: '#8B5CF6' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Instagram */}
        <View style={styles.platformRow}>
          <View style={styles.platLeft}>
            <View style={[styles.platIconCircle, { backgroundColor: 'rgba(225, 48, 108, 0.15)' }]}>
              <Ionicons name="logo-instagram" size={18} color="#E1306C" />
            </View>
            <View>
              <Text style={styles.platTitle}>{t('instagramReels')}</Text>
              <Text style={styles.platMeta}>Meta Graph v19 Reels Container</Text>
            </View>
          </View>
          <Switch
            value={platforms.instagram}
            onValueChange={() => togglePlatform('instagram')}
            trackColor={{ false: '#334155', true: '#8B5CF6' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Facebook */}
        <View style={[styles.platformRow, { borderBottomWidth: 0 }]}>
          <View style={styles.platLeft}>
            <View style={[styles.platIconCircle, { backgroundColor: 'rgba(24, 119, 242, 0.15)' }]}>
              <Ionicons name="logo-facebook" size={18} color="#1877F2" />
            </View>
            <View>
              <Text style={styles.platTitle}>{t('facebookWatch')}</Text>
              <Text style={styles.platMeta}>Page Feed & Video Webhook</Text>
            </View>
          </View>
          <Switch
            value={platforms.facebook}
            onValueChange={() => togglePlatform('facebook')}
            trackColor={{ false: '#334155', true: '#8B5CF6' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Release Scheduling Options */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>{t('schedulingOption')}</Text>

        <View style={styles.scheduleChoicesRow}>
          <TouchableOpacity
            style={[
              styles.choiceBtn,
              immediatePublish && styles.choiceBtnActive,
            ]}
            onPress={() => setImmediatePublish(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="flash"
              size={16}
              color={immediatePublish ? '#10B981' : '#94A3B8'}
            />
            <Text
              style={[
                styles.choiceBtnText,
                immediatePublish && styles.choiceBtnTextActive,
              ]}
            >
              {t('publishNow')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.choiceBtn,
              !immediatePublish && styles.choiceBtnActive,
            ]}
            onPress={() => setImmediatePublish(false)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="calendar"
              size={16}
              color={!immediatePublish ? '#8B5CF6' : '#94A3B8'}
            />
            <Text
              style={[
                styles.choiceBtnText,
                !immediatePublish && styles.choiceBtnTextActive,
              ]}
            >
              Assign to 4-Slot Engine
            </Text>
          </TouchableOpacity>
        </View>

        {/* Slot selector when scheduling */}
        {!immediatePublish && (
          <View style={styles.slotPickerContainer}>
            <Text style={styles.slotPickerLabel}>Select Target Daily Slot:</Text>
            <View style={styles.slotChipsRow}>
              {[
                { idx: 0, time: '09:00 AM' },
                { idx: 1, time: '01:15 PM' },
                { idx: 2, time: '06:30 PM' },
                { idx: 3, time: '09:45 PM' },
              ].map((s) => (
                <TouchableOpacity
                  key={s.idx}
                  style={[
                    styles.slotChip,
                    assignedSlotIdx === s.idx && styles.slotChipActive,
                  ]}
                  onPress={() => setAssignedSlotIdx(s.idx)}
                >
                  <Text
                    style={[
                      styles.slotChipText,
                      assignedSlotIdx === s.idx && styles.slotChipTextActive,
                    ]}
                  >
                    {s.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Launch Upload Button */}
      <TouchableOpacity
        style={[styles.launchBtn, isUploading && styles.launchBtnDisabled]}
        onPress={handleStartUpload}
        disabled={isUploading}
        activeOpacity={0.85}
      >
        {isUploading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <Ionicons name="rocket-outline" size={18} color="#FFFFFF" />
            <Text style={styles.launchBtnText}>
              {immediatePublish
                ? t('startUploadBtn')
                : language === 'hi'
                ? 'दैनिक स्लॉट में जोड़ें और ऑटो-सिंडिकेट करें'
                : 'Schedule to 4-Slot Daily Engine'}
            </Text>
          </>
        )}
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
  uploadProgressCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    marginBottom: 16,
  },
  uploadProgressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  uploadStatusStep: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  uploadPercent: {
    color: '#8B5CF6',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 8,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#0F172A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  successTitle: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
  successDesc: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  clipDurationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  clipDurationText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  clipScroll: {
    flexDirection: 'row',
  },
  clipCard: {
    width: 140,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#334155',
    position: 'relative',
  },
  clipCardSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  clipThumb: {
    width: '100%',
    height: 75,
    borderRadius: 8,
    marginBottom: 6,
  },
  clipDurationPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  clipDurationVal: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  clipSelectedCheck: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  clipTitle: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
  },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.45)',
    padding: 14,
    marginBottom: 14,
  },
  aiIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiBannerTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  neuralPill: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  neuralText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  aiBannerSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textInput: {
    color: '#F8FAFC',
    fontSize: 13,
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  platLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  platIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  platMeta: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 1,
  },
  scheduleChoicesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  choiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  choiceBtnActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: '#8B5CF6',
  },
  choiceBtnText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  choiceBtnTextActive: {
    color: '#F8FAFC',
  },
  slotPickerContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  slotPickerLabel: {
    color: '#64748B',
    fontSize: 11,
    marginBottom: 6,
  },
  slotChipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  slotChip: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  slotChipActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    borderColor: '#8B5CF6',
  },
  slotChipText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  slotChipTextActive: {
    color: '#8B5CF6',
  },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    borderRadius: 16,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 6,
  },
  launchBtnDisabled: {
    opacity: 0.6,
  },
  launchBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
