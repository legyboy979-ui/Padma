import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLanguage } from '../context/LanguageContext';

interface ArchitectureModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ visible, onClose }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'diagram' | 'github' | 'env' | 'apis'>('diagram');
  const [copied, setCopied] = useState(false);

  if (!visible) return null;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const dockerComposeSnippet = `# OmniStream AI - Production Deployment
version: '3.8'

services:
  omnistream-app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - API_GATEWAY_URL=https://api.omnistream.ai
    depends_on:
      - redis
      - worker-ingest

  worker-ingest:
    image: omnistream/celery-worker:latest
    command: celery -A core.tasks worker --concurrency=4 -l info
    environment:
      - REDIS_URL=redis://redis:6379/0
      - GMAIL_POLL_INTERVAL=30
      - YOUTUBE_API_KEY=\${YOUTUBE_API_KEY}
      - META_GRAPH_TOKEN=\${META_GRAPH_TOKEN}

  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:`;

  const githubActionsSnippet = `name: OmniStream CI/CD Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js & Bun
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Expo Platform Export (Universal)
        run: npx expo export --platform all

      - name: Run Biometric Enclave & MFA Tests
        run: npm run test:security

      - name: Deploy to Cloud Repository & Cluster
        run: |
          docker build -t omnistream/core:v4.2 .
          echo "OmniStream AI Autonomous Engine Live"`;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="git-branch" size={20} color="#06B6D4" />
              </View>
              <View>
                <Text style={styles.title}>System Architecture & GitHub Docs</Text>
                <Text style={styles.sub}>
                  {language === 'hi'
                    ? 'प्रोडक्शन ब्लूप्रिंट एवं गिटहब डिप्लॉयमेंट स्पेसिफिकेशन'
                    : 'Full-Stack Microservices Blueprint & CI/CD Specs'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Nav Tabs */}
          <View style={styles.tabsRow}>
            {[
              { id: 'diagram', label: 'Pipeline Diagram', icon: 'git-network-outline' },
              { id: 'apis', label: 'Social APIs', icon: 'cloud-done-outline' },
              { id: 'github', label: 'GitHub CI/CD', icon: 'logo-github' },
              { id: 'env', label: 'Env Config', icon: 'key-outline' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabBtn, activeTab === tab.id && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab.id as any)}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={14}
                  color={activeTab === tab.id ? '#06B6D4' : '#64748B'}
                />
                <Text
                  style={[styles.tabBtnText, activeTab === tab.id && styles.tabBtnTextActive]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {activeTab === 'diagram' && (
              <View style={styles.diagramContainer}>
                <Text style={styles.sectionHeading}>
                  1. Multi-Platform Autonomous Ingest & Syndication Pipeline
                </Text>

                {/* Flow steps */}
                <View style={styles.stepCard}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNum}>01</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepTitle}>Multi-Source Ingest Layer</Text>
                    <Text style={styles.stepDesc}>
                      • Gmail IMAP / Google PubSub Webhook: Scans subject tags [OMNI-CLIP].{'\n'}
                      • Direct Mobile Media Picker: 4K H.264 / H.265 chunked uploader.{'\n'}
                      • Cloud Dropper Bot: S3 / Google Drive presigned video buckets.
                    </Text>
                  </View>
                </View>

                <View style={styles.arrowRow}>
                  <Ionicons name="arrow-down" size={18} color="#06B6D4" />
                </View>

                <View style={styles.stepCard}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNum}>02</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepTitle}>OmniPrompt™ AI Metadata Engine</Text>
                    <Text style={styles.stepDesc}>
                      • High-retention hook extraction via Claude 3.7 & GPT-4o.{'\n'}
                      • Real-time CTR predictor scoring candidate titles (90%+).{'\n'}
                      • Dynamic hashtag clustering (Trending, Niche, High-Volume).
                    </Text>
                  </View>
                </View>

                <View style={styles.arrowRow}>
                  <Ionicons name="arrow-down" size={18} color="#06B6D4" />
                </View>

                <View style={styles.stepCard}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNum}>03</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepTitle}>High-Volume 4+ Daily Slot Engine</Text>
                    <Text style={styles.stepDesc}>
                      • Strategic Peak Engagement Hours: 09:00 AM, 01:15 PM, 06:30 PM, 09:45 PM.{'\n'}
                      • Redis Priority Queue with atomic slot locks.{'\n'}
                      • Granular RBAC approval gates before public dispatch.
                    </Text>
                  </View>
                </View>

                <View style={styles.arrowRow}>
                  <Ionicons name="arrow-down" size={18} color="#06B6D4" />
                </View>

                <View style={styles.stepCard}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNum}>04</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepTitle}>Simultaneous Social API Dispatcher</Text>
                    <Text style={styles.stepDesc}>
                      • YouTube Data API v3: Resumable chunked upload protocol.{'\n'}
                      • Instagram Reels API v19: Video container publish handshake.{'\n'}
                      • Facebook Graph API v19: Page feed video publishing.
                    </Text>
                  </View>
                </View>

                <View style={styles.arrowRow}>
                  <Ionicons name="arrow-down" size={18} color="#06B6D4" />
                </View>

                <View style={styles.stepCard}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNum}>05</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepTitle}>Financial Clearing & Instant Wallet</Text>
                    <Text style={styles.stepDesc}>
                      • AdSense, FB In-stream & Instagram creator revenue polling.{'\n'}
                      • NPCI IMPS / UPI VPA automated payouts with 1% TDS slip.
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'apis' && (
              <View style={styles.diagramContainer}>
                <Text style={styles.sectionHeading}>Social & Ingest API Integrations</Text>

                <View style={styles.apiSpecCard}>
                  <View style={styles.apiHeaderRow}>
                    <Ionicons name="logo-youtube" size={18} color="#EF4444" />
                    <Text style={styles.apiName}>YouTube Data API v3</Text>
                    <View style={styles.apiBadge}>
                      <Text style={styles.apiBadgeText}>REST OAuth2</Text>
                    </View>
                  </View>
                  <Text style={styles.apiCode}>
                    POST https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status
                  </Text>
                  <Text style={styles.apiNotes}>
                    Includes automated Shorts categorization, notifySubscribers flag, and scheduled release time.
                  </Text>
                </View>

                <View style={styles.apiSpecCard}>
                  <View style={styles.apiHeaderRow}>
                    <Ionicons name="logo-instagram" size={18} color="#E1306C" />
                    <Text style={styles.apiName}>Instagram Reels Graph API v19</Text>
                    <View style={styles.apiBadge}>
                      <Text style={styles.apiBadgeText}>Meta Graph</Text>
                    </View>
                  </View>
                  <Text style={styles.apiCode}>
                    POST graph.facebook.com/v19.0/{'{ig-user-id}'}/media?media_type=REELS&video_url=...
                  </Text>
                  <Text style={styles.apiNotes}>
                    Creates container, monitors status_code=FINISHED, and triggers /media_publish.
                  </Text>
                </View>

                <View style={styles.apiSpecCard}>
                  <View style={styles.apiHeaderRow}>
                    <Ionicons name="logo-facebook" size={18} color="#1877F2" />
                    <Text style={styles.apiName}>Facebook Graph API v19</Text>
                    <View style={styles.apiBadge}>
                      <Text style={styles.apiBadgeText}>Graph Pages</Text>
                    </View>
                  </View>
                  <Text style={styles.apiCode}>
                    POST graph.facebook.com/v19.0/{'{page-id}'}/videos?description=...
                  </Text>
                  <Text style={styles.apiNotes}>
                    Transfers binary to Facebook Page reels stream with monetization enable tags.
                  </Text>
                </View>

                <View style={styles.apiSpecCard}>
                  <View style={styles.apiHeaderRow}>
                    <Ionicons name="mail" size={18} color="#EA4335" />
                    <Text style={styles.apiName}>Gmail Pub/Sub Video Harvester</Text>
                    <View style={styles.apiBadge}>
                      <Text style={styles.apiBadgeText}>IMAP Webhook</Text>
                    </View>
                  </View>
                  <Text style={styles.apiCode}>
                    POST https://gmail.googleapis.com/gmail/v1/users/me/watch
                  </Text>
                  <Text style={styles.apiNotes}>
                    Filters subject tags `[OMNI-CLIP]` and pulls high-bitrate video attachments.
                  </Text>
                </View>
              </View>
            )}

            {activeTab === 'github' && (
              <View style={styles.diagramContainer}>
                <View style={styles.snippetHeaderRow}>
                  <Text style={styles.sectionHeading}>.github/workflows/deploy.yml</Text>
                  <TouchableOpacity style={styles.copyPill} onPress={handleCopy}>
                    <Ionicons name="copy-outline" size={13} color="#06B6D4" />
                    <Text style={styles.copyPillText}>{copied ? 'Copied!' : 'Copy Code'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.codeSnippetBox}>
                  <Text style={styles.codeText}>{githubActionsSnippet}</Text>
                </View>

                <View style={[styles.snippetHeaderRow, { marginTop: 16 }]}>
                  <Text style={styles.sectionHeading}>docker-compose.yml</Text>
                </View>
                <View style={styles.codeSnippetBox}>
                  <Text style={styles.codeText}>{dockerComposeSnippet}</Text>
                </View>
              </View>
            )}

            {activeTab === 'env' && (
              <View style={styles.diagramContainer}>
                <Text style={styles.sectionHeading}>Production Environment Configuration</Text>
                <View style={styles.codeSnippetBox}>
                  <Text style={styles.codeText}>
{`# OmniStream AI Environment Spec
NODE_ENV=production
APP_NAME=OmniStreamAI

# Social API Credentials
YOUTUBE_CLIENT_ID=omni_yt_oauth_client_id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
META_APP_ID=981240918237102
META_APP_SECRET=a8b9f012c491823d0124891b
INSTAGRAM_PAGE_ID=178414019283719

# Gmail Harvester Daemon
GMAIL_SERVICE_ACCOUNT_EMAIL=harvester@omnistream-ai.iam.gserviceaccount.com
GMAIL_SUBJECT_PREFIX=[OMNI-CLIP]
GMAIL_INBOX_POLL_SEC=15

# AI Prompt Synthesis
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx

# Security & Hardware Biometrics
HARDWARE_ENCLAVE_PUB_KEY=tpm_sec_2026_omnistream_hw
PASSCODE_SALT=oms_argon2id_secure_salt

# Monetization & NPCI UPI Rails
RAZORPAY_UPI_KEY_ID=rzp_live_xxxxxxxx
RAZORPAY_UPI_KEY_SECRET=xxxxxxxxxxxxxxxx`}
                  </Text>
                </View>
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
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 16,
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
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1E293B',
  },
  tabBtnActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: '#06B6D4',
  },
  tabBtnText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: '#06B6D4',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  diagramContainer: {
    paddingBottom: 24,
  },
  sectionHeading: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    color: '#06B6D4',
    fontSize: 12,
    fontWeight: '800',
  },
  stepTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  stepDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
  },
  arrowRow: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  apiSpecCard: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  apiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  apiName: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  apiBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  apiBadgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  apiCode: {
    color: '#A78BFA',
    fontSize: 11,
    fontFamily: 'monospace',
    backgroundColor: '#0F172A',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  apiNotes: {
    color: '#94A3B8',
    fontSize: 11,
  },
  snippetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  copyPillText: {
    color: '#06B6D4',
    fontSize: 11,
    fontWeight: '600',
  },
  codeSnippetBox: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 8,
  },
  codeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
