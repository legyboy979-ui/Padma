import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { AiTone, AiGeneratedContent } from '../types';

interface AiOptimizerModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (data: { title: string; description: string; hashtags: string[] }) => void;
  initialTopic?: string;
}

export const AiOptimizerModal: React.FC<AiOptimizerModalProps> = ({
  visible,
  onClose,
  onApply,
  initialTopic = '',
}) => {
  const { generateAiContent } = useApp();
  const { language } = useLanguage();

  const [topic, setTopic] = useState(initialTopic);
  const [tone, setTone] = useState<AiTone>('viral_hype');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AiGeneratedContent | null>(null);
  const [selectedTitleIdx, setSelectedTitleIdx] = useState(0);
  const [copiedNotification, setCopiedNotification] = useState(false);

  if (!visible) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateAiContent(
        topic.trim() || '2026 AI Content Empire Automation',
        tone
      );
      setResult(generated);
      setSelectedTitleIdx(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    const allTags = [
      ...result.trendingTags,
      ...result.nicheTags,
      ...result.highVolumeTags,
    ];
    onApply({
      title: result.titles[selectedTitleIdx]?.title || '',
      description: result.description,
      hashtags: allTags,
    });
    onClose();
  };

  const handleCopyTags = () => {
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 1500);
  };

  const toneOptions: { id: AiTone; labelEn: string; labelHi: string; icon: string }[] = [
    { id: 'viral_hype', labelEn: '🔥 Viral Hype', labelHi: '🔥 वायरल हाइप', icon: 'flame' },
    { id: 'professional_tech', labelEn: '💼 Pro Tech', labelHi: '💼 टेक व प्रो', icon: 'briefcase' },
    { id: 'educational', labelEn: '🧠 Deep-Dive', labelHi: '🧠 ज्ञानवर्धक', icon: 'school' },
    { id: 'desi_hindi', labelEn: '🇮🇳 देसी तड़का', labelHi: '🇮🇳 देसी हुक', icon: 'sparkles' },
    { id: 'casual', labelEn: '🎙️ Casual', labelHi: '🎙️ बातचीत', icon: 'mic' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="sparkles" size={18} color="#8B5CF6" />
              </View>
              <View>
                <Text style={styles.title}>OmniPrompt™ AI Studio</Text>
                <Text style={styles.sub}>
                  {language === 'hi'
                    ? 'वायरल हुक्स, उच्च CTR शीर्षक और स्मार्ट टैग जनरेटर'
                    : 'Neural CTR Titles, Structured SEO & Viral Tags'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Input Video Topic */}
            <Text style={styles.inputLabel}>
              {language === 'hi' ? 'वीडियो विषय / कीवर्ड / कच्ची स्क्रिप्ट' : 'Video Topic / Script / Hook'}
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.topicInput}
                placeholder={
                  language === 'hi'
                    ? 'उदा. 2026 के टॉप 5 AI टूल्स, कोडिंग ऑटोमेशन...'
                    : 'e.g. 5 Autonomous AI tools that replace dev teams in 2026...'
                }
                placeholderTextColor="#64748B"
                value={topic}
                onChangeText={setTopic}
                multiline
              />
            </View>

            {/* Tone Selector */}
            <Text style={styles.inputLabel}>
              {language === 'hi' ? 'टोन एवं ऑडीयंस स्टाइल' : 'Audience Tone & Resonance'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toneScroll}>
              {toneOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.toneChip, tone === opt.id && styles.toneChipActive]}
                  onPress={() => setTone(opt.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.toneChipText, tone === opt.id && styles.toneChipTextActive]}
                  >
                    {language === 'hi' ? opt.labelHi : opt.labelEn}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Generate Action Button */}
            <TouchableOpacity
              style={styles.generateBtn}
              onPress={handleGenerate}
              disabled={isGenerating}
              activeOpacity={0.8}
            >
              {isGenerating ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={17} color="#FFFFFF" />
                  <Text style={styles.generateBtnText}>
                    {language === 'hi'
                      ? 'AI न्यूरल मॉडल से जनरेट करें'
                      : 'Synthesize Optimized Metadata'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Results Section */}
            {result && (
              <View style={styles.resultContainer}>
                {/* Virality Score Badge */}
                <View style={styles.scoreRow}>
                  <View style={styles.scoreCard}>
                    <Ionicons name="rocket-outline" size={16} color="#06B6D4" />
                    <Text style={styles.scoreLabel}>
                      {language === 'hi' ? 'वायरलिटी स्कोर:' : 'Virality Forecast:'}
                    </Text>
                    <Text style={styles.scoreValue}>{result.viralityScore}/100</Text>
                  </View>
                  <View style={styles.scoreCard}>
                    <Ionicons name="time-outline" size={16} color="#F59E0B" />
                    <Text style={styles.scoreLabel}>
                      {language === 'hi' ? 'सर्वोत्तम समय:' : 'Peak Time:'}
                    </Text>
                    <Text style={styles.scoreValue}>{result.bestTimeToPost}</Text>
                  </View>
                </View>

                {/* Title Options */}
                <Text style={styles.sectionHeader}>
                  {language === 'hi' ? 'उच्च CTR शीर्षक विकल्प (एक चुनें):' : 'High-CTR Title Candidates (Select One):'}
                </Text>
                {result.titles.map((tItem, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.titleOptionCard,
                      selectedTitleIdx === idx && styles.titleOptionSelected,
                    ]}
                    onPress={() => setSelectedTitleIdx(idx)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.titleOptionTop}>
                      <View style={styles.ctrPill}>
                        <Ionicons name="trending-up" size={12} color="#10B981" />
                        <Text style={styles.ctrText}>{tItem.ctrPredicted}% CTR</Text>
                      </View>
                      <Ionicons
                        name={selectedTitleIdx === idx ? 'radio-button-on' : 'radio-button-off'}
                        size={18}
                        color={selectedTitleIdx === idx ? '#8B5CF6' : '#64748B'}
                      />
                    </View>
                    <Text style={styles.titleText}>{tItem.title}</Text>
                  </TouchableOpacity>
                ))}

                {/* Description Preview */}
                <Text style={styles.sectionHeader}>
                  {language === 'hi' ? 'अनुकूलित विवरण और टाइमस्टैम्प्स:' : 'Structured Description & Hooks:'}
                </Text>
                <View style={styles.descBox}>
                  <Text style={styles.descText}>{result.description}</Text>
                </View>

                {/* Categorized Hashtags */}
                <View style={styles.tagsHeaderRow}>
                  <Text style={styles.sectionHeader}>
                    {language === 'hi' ? 'स्मार्ट हैशटैग क्लस्टर्स:' : 'Smart Hashtag Clusters:'}
                  </Text>
                  <TouchableOpacity onPress={handleCopyTags} style={styles.copyBtn}>
                    <Ionicons name="copy-outline" size={14} color="#38BDF8" />
                    <Text style={styles.copyBtnText}>
                      {copiedNotification
                        ? language === 'hi'
                          ? 'कॉपी हुआ!'
                          : 'Copied!'
                        : language === 'hi'
                        ? 'कॉपी'
                        : 'Copy'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.tagWrap}>
                  <Text style={styles.tagGroupLabel}>Trending:</Text>
                  {result.trendingTags.map((tag) => (
                    <View key={tag} style={[styles.tagPill, styles.tagTrending]}>
                      <Text style={styles.tagTrendingText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.tagWrap}>
                  <Text style={styles.tagGroupLabel}>Niche:</Text>
                  {result.nicheTags.map((tag) => (
                    <View key={tag} style={[styles.tagPill, styles.tagNiche]}>
                      <Text style={styles.tagNicheText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.tagWrap}>
                  <Text style={styles.tagGroupLabel}>High-Vol:</Text>
                  {result.highVolumeTags.map((tag) => (
                    <View key={tag} style={styles.tagPill}>
                      <Text style={styles.tagPillText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                {/* Apply Button */}
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={handleApply}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
                  <Text style={styles.applyBtnText}>
                    {language === 'hi'
                      ? 'अपलोड फॉर्म में भरें'
                      : 'Apply Metadata to Upload Form'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 12, 0.88)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#1E293B',
    maxHeight: '92%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  sub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  inputLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
    marginBottom: 16,
  },
  topicInput: {
    color: '#F8FAFC',
    fontSize: 14,
    minHeight: 52,
  },
  toneScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  toneChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 8,
  },
  toneChipActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8B5CF6',
  },
  toneChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  toneChipTextActive: {
    color: '#A78BFA',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  resultContainer: {
    paddingBottom: 24,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  scoreCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  scoreLabel: {
    color: '#94A3B8',
    fontSize: 11,
  },
  scoreValue: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 8,
  },
  titleOptionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
  },
  titleOptionSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  titleOptionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ctrPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ctrText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  titleText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  descBox: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  descText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
  },
  tagsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 6,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyBtnText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tagGroupLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    marginRight: 4,
  },
  tagPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tagPillText: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  tagTrending: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  tagTrendingText: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: '600',
  },
  tagNiche: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  tagNicheText: {
    color: '#38BDF8',
    fontSize: 11,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 14,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
