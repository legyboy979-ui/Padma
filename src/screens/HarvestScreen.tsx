import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Switch,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

export const HarvestScreen: React.FC = () => {
  const {
    harvestedEmails,
    triggerGmailSweep,
    isHarvesting,
    importHarvestedEmailToPipeline,
  } = useApp();
  const { t, language } = useLanguage();

  const [autoScheduleToggle, setAutoScheduleToggle] = useState(true);
  const [autoTranscribeToggle, setAutoTranscribeToggle] = useState(true);
  const [filterSubjectTag, setFilterSubjectTag] = useState('[OMNI-CLIP]');
  const [notice, setNotice] = useState<string | null>(null);

  const handleSweep = async () => {
    const count = await triggerGmailSweep();
    setNotice(
      language === 'hi'
        ? `जीमेल स्कैन पूर्ण: ${count} नया वीडियो इनजेस्ट हुआ!`
        : `Gmail Sweep Complete: ${count} new video attachment harvested!`
    );
    setTimeout(() => setNotice(null), 3000);
  };

  const handleImport = (id: string) => {
    importHarvestedEmailToPipeline(id, 2);
    setNotice(
      language === 'hi'
        ? 'वीडियो स्वचालित रूप से स्लॉट 3 में शेड्यूल कर दिया गया!'
        : 'Harvested clip auto-scheduled into Daily Slot 3!'
    );
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Ionicons name="mail-unread" size={18} color="#EF4444" />
        </View>
        <View>
          <Text style={styles.title}>{t('harvestTitle')}</Text>
          <Text style={styles.sub}>{t('harvestSubtitle')}</Text>
        </View>
      </View>

      {/* Notice alert */}
      {notice && (
        <View style={styles.noticeBox}>
          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          <Text style={styles.noticeText}>{notice}</Text>
        </View>
      )}

      {/* Connected Gmail Box */}
      <View style={styles.card}>
        <View style={styles.inboxTopRow}>
          <View style={styles.inboxLeft}>
            <View style={styles.gmailIconCircle}>
              <Ionicons name="logo-google" size={18} color="#EA4335" />
            </View>
            <View>
              <Text style={styles.inboxLabel}>{t('connectedInbox')}</Text>
              <Text style={styles.inboxEmail}>clips-ingest@omnistream.agency</Text>
            </View>
          </View>
          <View style={styles.webhookPill}>
            <View style={styles.webhookDot} />
            <Text style={styles.webhookText}>Webhook Live</Text>
          </View>
        </View>

        {/* Sweep Trigger Button */}
        <TouchableOpacity
          style={[styles.sweepBtn, isHarvesting && styles.btnDisabled]}
          onPress={handleSweep}
          disabled={isHarvesting}
          activeOpacity={0.8}
        >
          {isHarvesting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="refresh" size={16} color="#FFFFFF" />
              <Text style={styles.sweepBtnText}>
                {language === 'hi' ? 'जीमेल इनबॉक्स अभी स्कैन करें' : 'Sweep Gmail Inbox for Videos'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Automated Ingestion Rules Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>{t('harvestRules')}</Text>

        <View style={styles.ruleItem}>
          <Ionicons name="funnel-outline" size={16} color="#06B6D4" />
          <View style={{ flex: 1 }}>
            <Text style={styles.ruleTitle}>{t('subjectTagRule')}</Text>
            <Text style={styles.ruleDesc}>
              Filters emails containing tag [OMNI-CLIP] or [VIDEO-DROP] in subject line
            </Text>
          </View>
        </View>

        <View style={styles.ruleItem}>
          <Ionicons name="shield-checkmark-outline" size={16} color="#10B981" />
          <View style={{ flex: 1 }}>
            <Text style={styles.ruleTitle}>{t('whitelistRule')}</Text>
            <Text style={styles.ruleDesc}>
              Accepts video uploads only from whitelisted editors & partners
            </Text>
          </View>
        </View>

        {/* Toggles */}
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>
              {language === 'hi' ? 'स्वतः स्लॉट शेड्यूलिंग' : 'Auto-Schedule Harvested Clips'}
            </Text>
            <Text style={styles.toggleDesc}>
              Directly assign finished clips into the next open daily 4-slot
            </Text>
          </View>
          <Switch
            value={autoScheduleToggle}
            onValueChange={setAutoScheduleToggle}
            trackColor={{ false: '#334155', true: '#8B5CF6' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>
              {language === 'hi' ? 'AI ऑटो-ट्रांस्क्रिप्ट और टैग्स' : 'AI Speech-to-Text & Auto-Tagging'}
            </Text>
            <Text style={styles.toggleDesc}>
              Extract video voice transcript and generate SEO metadata automatically
            </Text>
          </View>
          <Switch
            value={autoTranscribeToggle}
            onValueChange={setAutoTranscribeToggle}
            trackColor={{ false: '#334155', true: '#8B5CF6' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Harvested Video Feeds */}
      <View style={styles.feedSection}>
        <Text style={styles.sectionHeading}>{t('recentHarvested')}</Text>

        {harvestedEmails.map((mail) => {
          const isScheduled = mail.status === 'auto_scheduled';
          return (
            <View key={mail.id} style={styles.mailCard}>
              <View style={styles.mailTop}>
                <View style={styles.senderLeft}>
                  <Ionicons name="mail" size={14} color="#EF4444" />
                  <Text style={styles.senderName}>{mail.senderName}</Text>
                  <Text style={styles.receivedTime}>• {mail.receivedAt}</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    isScheduled ? styles.statusScheduled : styles.statusReview,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      isScheduled ? styles.statusTextScheduled : styles.statusTextReview,
                    ]}
                  >
                    {isScheduled
                      ? language === 'hi' ? 'ऑटो-शेड्यूल' : 'Auto-Scheduled'
                      : language === 'hi' ? 'समीक्षा हेतु' : 'Pending Review'}
                  </Text>
                </View>
              </View>

              <Text style={styles.mailSubject}>{mail.subject}</Text>

              {/* Video Attachment Details */}
              <View style={styles.attachmentBox}>
                <Image source={{ uri: mail.videoThumbnail }} style={styles.attachmentThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.extractedTitle} numberOfLines={2}>
                    {mail.extractedTitle}
                  </Text>
                  <View style={styles.attachmentMetaRow}>
                    <View style={styles.fileSizeBadge}>
                      <Ionicons name="document-attach" size={11} color="#38BDF8" />
                      <Text style={styles.fileSizeText}>{mail.attachmentSize}</Text>
                    </View>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {mail.attachmentName}
                    </Text>
                  </View>

                  {/* Suggested Tags */}
                  <View style={styles.tagsRow}>
                    {mail.suggestedTags.slice(0, 3).map((tag) => (
                      <View key={tag} style={styles.tagBadge}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Action Button */}
              {!isScheduled && (
                <TouchableOpacity
                  style={styles.importBtn}
                  onPress={() => handleImport(mail.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add-circle" size={16} color="#FFFFFF" />
                  <Text style={styles.importBtnText}>
                    {language === 'hi'
                      ? 'पाइपलाइन में जोड़ें और ऑटो-शेड्यूल करें'
                      : 'Import & Queue to High-Volume Slot'}
                  </Text>
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
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
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
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  noticeText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  inboxTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  inboxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gmailIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(234, 67, 53, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inboxLabel: {
    color: '#64748B',
    fontSize: 11,
  },
  inboxEmail: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  webhookPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  webhookDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  webhookText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  sweepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  sweepBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cardLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  ruleTitle: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },
  ruleDesc: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  toggleTitle: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  toggleDesc: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
    maxWidth: 240,
  },
  feedSection: {
    marginTop: 4,
  },
  sectionHeading: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  mailCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 12,
  },
  mailTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  senderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  senderName: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },
  receivedTime: {
    color: '#64748B',
    fontSize: 11,
  },
  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusScheduled: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusReview: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextScheduled: {
    color: '#10B981',
  },
  statusTextReview: {
    color: '#F59E0B',
  },
  mailSubject: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  attachmentBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  attachmentThumb: {
    width: 68,
    height: 68,
    borderRadius: 8,
  },
  extractedTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  attachmentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  fileSizeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#0F172A',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  fileSizeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  fileName: {
    color: '#64748B',
    fontSize: 10,
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
  },
  tagBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    color: '#A78BFA',
    fontSize: 9,
    fontWeight: '600',
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8B5CF6',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  importBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
