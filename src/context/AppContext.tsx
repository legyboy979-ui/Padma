import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  VideoItem,
  HarvestedEmail,
  TeamMember,
  WalletTransaction,
  SocialChannelAccount,
  DailySlot,
  AiTone,
  AiGeneratedContent,
  UserPermissions,
  PlatformConfig,
} from '../types';
import {
  initialVideos,
  initialSocialAccounts,
  initialHarvestedEmails,
  initialTeamMembers,
  initialTransactions,
  initialDailySlots,
  initialAuditLogs,
} from '../data/mockData';
import { useAuth } from './AuthContext';

interface AppContextType {
  videos: VideoItem[];
  dailySlots: DailySlot[];
  harvestedEmails: HarvestedEmail[];
  socialAccounts: SocialChannelAccount[];
  teamMembers: TeamMember[];
  transactions: WalletTransaction[];
  auditLogs: typeof initialAuditLogs;
  isHarvesting: boolean;
  isUploading: boolean;
  uploadProgress: number; // 0 - 100
  uploadStatusStep: string;
  addVideo: (video: Omit<VideoItem, 'id'>) => void;
  scheduleVideoToSlot: (videoId: string, slotIndex: number) => void;
  removeVideoFromSlot: (slotIndex: number) => void;
  togglePlatformSync: (platform: 'youtube' | 'facebook' | 'instagram') => void;
  uploadSimultaneously: (
    videoData: {
      title: string;
      description: string;
      hashtags: string[];
      thumbnailUrl: string;
      platforms: PlatformConfig;
      slotIndex?: number;
      immediatePublish: boolean;
    },
    onComplete: () => void
  ) => void;
  triggerGmailSweep: () => Promise<number>;
  importHarvestedEmailToPipeline: (emailId: string, slotIndex?: number) => void;
  updateMemberPermissions: (memberId: string, permissions: Partial<UserPermissions>) => void;
  inviteMember: (name: string, email: string, role: TeamMember['role']) => void;
  processWithdrawal: (amount: number, method: 'UPI' | 'IMPS', destination: string) => Promise<boolean>;
  upgradePlan: (plan: 'monthly_500' | 'quarterly_1350') => void;
  generateAiContent: (topic: string, tone: AiTone) => Promise<AiGeneratedContent>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [dailySlots, setDailySlots] = useState<DailySlot[]>(initialDailySlots);
  const [harvestedEmails, setHarvestedEmails] = useState<HarvestedEmail[]>(initialHarvestedEmails);
  const [socialAccounts, setSocialAccounts] = useState<SocialChannelAccount[]>(initialSocialAccounts);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(initialTransactions);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);

  const [isHarvesting, setIsHarvesting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusStep, setUploadStatusStep] = useState('');

  // Map videos to daily slots
  useEffect(() => {
    const updatedSlots = initialDailySlots.map((slot) => {
      const assigned = videos.find((v) => v.slotIndex === slot.slotIndex && v.scheduledDate === '2026-09-20');
      return {
        ...slot,
        assignedVideo: assigned,
      };
    });
    setDailySlots(updatedSlots);
  }, [videos]);

  const addVideo = (videoData: Omit<VideoItem, 'id'>) => {
    const newVideo: VideoItem = {
      ...videoData,
      id: `vid_${Date.now()}`,
    };
    setVideos((prev) => [newVideo, ...prev]);
  };

  const scheduleVideoToSlot = (videoId: string, slotIndex: number) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            slotIndex,
            scheduledSlotTime: initialDailySlots[slotIndex].timeStr,
            status: 'scheduled',
          };
        }
        return v;
      })
    );
  };

  const removeVideoFromSlot = (slotIndex: number) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.slotIndex === slotIndex) {
          return {
            ...v,
            slotIndex: -1,
            status: 'draft',
          };
        }
        return v;
      })
    );
  };

  const togglePlatformSync = (platform: 'youtube' | 'facebook' | 'instagram') => {
    setSocialAccounts((prev) =>
      prev.map((acc) => {
        if (acc.platform === platform) {
          const nextStatus = acc.status === 'connected' ? 'reauth_needed' : 'connected';
          return { ...acc, status: nextStatus };
        }
        return acc;
      })
    );
  };

  // Simultaneous multi-platform upload engine
  const uploadSimultaneously = (
    videoData: {
      title: string;
      description: string;
      hashtags: string[];
      thumbnailUrl: string;
      platforms: PlatformConfig;
      slotIndex?: number;
      immediatePublish: boolean;
    },
    onComplete: () => void
  ) => {
    setIsUploading(true);
    setUploadProgress(10);
    setUploadStatusStep('Transcoding 4K H.264 bitstream & packaging...');

    setTimeout(() => {
      setUploadProgress(35);
      setUploadStatusStep('Dispatching to YouTube Data API v3 (Direct Chunked Upload)...');
    }, 700);

    setTimeout(() => {
      setUploadProgress(65);
      setUploadStatusStep('Synthesizing Meta Graph API v19 container for Instagram Reels...');
    }, 1400);

    setTimeout(() => {
      setUploadProgress(85);
      setUploadStatusStep('Publishing to Facebook Page Watch & Video Webhook...');
    }, 2100);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStatusStep('Syndication Complete on All 3 Platforms!');

      const assignedSlot = videoData.slotIndex !== undefined ? videoData.slotIndex : 0;
      const newVideo: VideoItem = {
        id: `vid_${Date.now()}`,
        title: videoData.title,
        description: videoData.description,
        hashtags: videoData.hashtags,
        thumbnailUrl: videoData.thumbnailUrl,
        videoDuration: '00:59',
        platforms: videoData.platforms,
        status: videoData.immediatePublish ? 'published' : 'scheduled',
        scheduledSlotTime: initialDailySlots[assignedSlot].timeStr,
        scheduledDate: '2026-09-20',
        slotIndex: assignedSlot,
        source: 'manual',
        views: videoData.immediatePublish ? 120 : 0,
        engagementScore: 95,
        publishedAt: videoData.immediatePublish ? 'Just now' : undefined,
        viralityForecast: 93,
      };

      setVideos((prev) => [newVideo, ...prev]);

      // Add audit log
      setAuditLogs((prev) => [
        {
          id: `log_${Date.now()}`,
          action: 'Multi-Platform Video Upload Dispatched',
          detail: `Uploaded "${videoData.title.slice(0, 35)}..." simultaneously to YouTube, FB & IG`,
          user: `${user.name} (${user.role})`,
          timestamp: 'Just now',
        },
        ...prev,
      ]);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStatusStep('');
        onComplete();
      }, 600);
    }, 2800);
  };

  // Gmail Ingest Sweep
  const triggerGmailSweep = async (): Promise<number> => {
    setIsHarvesting(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMail: HarvestedEmail = {
          id: `h_mail_${Date.now()}`,
          senderName: 'Deepak Rao (Remote Creator)',
          senderEmail: 'deepak.creator@omnistream.agency',
          subject: '[OMNI-CLIP] 2026 AI Prompt Engineering Secrets In 60s',
          receivedAt: 'Just now',
          attachmentName: 'ai_prompting_secrets_final.mp4',
          attachmentSize: '52.1 MB',
          status: 'pending_review',
          videoThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80',
          extractedTitle: '2026 AI Prompt Engineering Secrets in 60s',
          suggestedTags: ['#AIPrompting', '#ChatGPT5', '#TechHacks', '#Shorts'],
          downloadUrl: 'https://cdn.omnistream.ai/ingest/deepak_clip.mp4',
        };

        setHarvestedEmails((prev) => [newMail, ...prev]);
        setIsHarvesting(false);

        setAuditLogs((prev) => [
          {
            id: `log_${Date.now()}`,
            action: 'Gmail Harvester Sweep Completed',
            detail: 'Ingested 1 new video attachment from deepak.creator@omnistream.agency',
            user: 'Gmail Daemon Webhook',
            timestamp: 'Just now',
          },
          ...prev,
        ]);

        resolve(1);
      }, 1600);
    });
  };

  // Import harvested email into pipeline
  const importHarvestedEmailToPipeline = (emailId: string, slotIndex = 2) => {
    const item = harvestedEmails.find((e) => e.id === emailId);
    if (!item) return;

    // Mark as auto scheduled
    setHarvestedEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, status: 'auto_scheduled' } : e))
    );

    const newVideo: VideoItem = {
      id: `vid_harvest_${Date.now()}`,
      title: item.extractedTitle,
      description: `Automated Gmail harvest from ${item.senderName}. Ingested via OmniStream Daemon. Full high-res vertical MP4 syndicated across YouTube, Facebook & Instagram.`,
      hashtags: item.suggestedTags,
      thumbnailUrl: item.videoThumbnail,
      videoDuration: '00:54',
      platforms: { youtube: true, facebook: true, instagram: true },
      status: 'scheduled',
      scheduledSlotTime: initialDailySlots[slotIndex].timeStr,
      scheduledDate: '2026-09-20',
      slotIndex: slotIndex,
      source: 'gmail_harvest',
      senderEmail: item.senderEmail,
      viralityForecast: 91,
    };

    setVideos((prev) => [newVideo, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        action: 'Harvested Video Scheduled to Pipeline',
        detail: `Assigned "${item.extractedTitle.slice(0, 30)}..." to Slot ${slotIndex + 1}`,
        user: `${user.name}`,
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  // Team RBAC permissions
  const updateMemberPermissions = (memberId: string, perms: Partial<UserPermissions>) => {
    setTeamMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            permissions: { ...m.permissions, ...perms },
          };
        }
        return m;
      })
    );
  };

  const inviteMember = (name: string, email: string, role: TeamMember['role']) => {
    const newMember: TeamMember = {
      id: `tm_${Date.now()}`,
      name,
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      status: 'invited',
      lastActive: 'Invitation Pending',
      permissions: {
        canUpload: true,
        canSchedule: role === 'owner' || role === 'admin' || role === 'publisher',
        canManageChannels: role === 'owner' || role === 'admin',
        canWithdraw: role === 'owner' || role === 'analyst',
        canUseAi: true,
      },
      assignedChannels: ['youtube', 'instagram', 'facebook'],
    };
    setTeamMembers((prev) => [...prev, newMember]);
  };

  // Creator Wallet & Withdrawal
  const processWithdrawal = async (amount: number, method: 'UPI' | 'IMPS', destination: string): Promise<boolean> => {
    if (amount > user.walletBalanceINR) return false;

    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      title: `${method === 'UPI' ? 'Instant UPI Payout' : 'Bank IMPS Payout'} to ${destination}`,
      type: 'withdrawal',
      amountINR: amount,
      status: 'completed',
      timestamp: 'Just now',
      destination,
      referenceId: `${method}_OMS_${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      method,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update wallet balance
    updateUser({
      walletBalanceINR: user.walletBalanceINR - amount,
    });

    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        action: 'Wallet Withdrawal Processed',
        detail: `Withdrew ₹${amount.toLocaleString('en-IN')} via ${method} to ${destination}`,
        user: `${user.name}`,
        timestamp: 'Just now',
      },
      ...prev,
    ]);

    return true;
  };

  // Upgrade Subscription
  const upgradePlan = (plan: 'monthly_500' | 'quarterly_1350') => {
    updateUser({
      subscriptionPlan: plan,
      trialDaysRemaining: 0,
      subscriptionExpiresAt: plan === 'monthly_500' ? '2026-10-20T23:59:59Z' : '2026-12-20T23:59:59Z',
    });

    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        action: 'Subscription Plan Upgraded',
        detail: `Activated ${plan === 'monthly_500' ? 'Monthly Pro (₹500/mo)' : 'Quarterly Saver 3 Months (₹1,350)'}`,
        user: `${user.name}`,
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  // AI Prompt Generator
  const generateAiContent = async (topic: string, tone: AiTone): Promise<AiGeneratedContent> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let titles: { title: string; ctrPredicted: number }[] = [];
        let description = '';
        let trendingTags: string[] = [];
        let nicheTags: string[] = [];
        let highVolumeTags: string[] = [];
        let viralityScore = 92;

        if (tone === 'desi_hindi') {
          titles = [
            { title: `${topic || 'AI टूल्स 2026'} - ये 3 सीक्रेट ट्रिक्स आपको करोड़पति बना सकती हैं! 🚀`, ctrPredicted: 96 },
            { title: `सच जानकर होश उड़ जाएंगे: क्या AI इंसान को रिप्लेस करेगा? 🤯`, ctrPredicted: 92 },
            { title: `2026 में यूट्यूब और इंस्टा से रोज़ाना ₹5000 कमाने का असली तरीका 💰`, ctrPredicted: 89 },
          ];
          description = `🔥 इस वीडियो में हमने विस्तार से समझाया है कि कैसे 2026 के नए AI टूल्स आपके कंटेंट क्रिएशन को 10x तेज कर सकते हैं!\n\n📌 टाइमस्टैम्प्स:\n0:00 - सबसे बड़ा सीक्रेट\n0:25 - ऑटोमेशन डेमो\n0:50 - कमाई का असली फॉर्मूला\n\n👇 चैनल को सब्सक्राइब करें और कमेंट में अपना सवाल पूछें!`;
          trendingTags = ['#हिंदीTech', '#रीलक्रांति', '#AIटूल', '#देसीTech', '#ShortsHindi'];
          nicheTags = ['#OnlineEarning2026', '#IndianCreators', '#MakeMoneyOnline'];
          highVolumeTags = ['#Viral', '#Shorts', '#Reels', '#Trending'];
          viralityScore = 95;
        } else if (tone === 'viral_hype') {
          titles = [
            { title: `STOP Scrolling! The #1 AI Tool That Outperforms 99% of Devs in 2026 🚨`, ctrPredicted: 97 },
            { title: `I Tested 100 AI Tools: Only THESE 3 Actually Matter (Proof Inside) ⚡`, ctrPredicted: 94 },
            { title: `The Automation Loop Nobody Tells You About (How We Hit 1M Views) 📈`, ctrPredicted: 91 },
          ];
          description = `🚨 Do NOT skip this breakdown. If you are still posting manually in 2026, you are losing 80% of your organic social reach.\n\nHere is how OmniStream AI syndicates high-definition video across YouTube Shorts, Instagram Reels, and Facebook Watch simultaneously with zero latency.\n\n⏱️ TIMESTAMPS:\n0:00 - The Big Hook\n0:18 - Automated Workflow\n0:45 - The Unfair Growth Advantage\n\n🔔 Subscribe & turn on notifications for daily masterclasses!`;
          trendingTags = ['#ViralShorts', '#AlgorithmHack', '#AI2026', '#ReelsViral', '#ContentGrowth'];
          nicheTags = ['#AutomationEngine', '#CreatorAgency', '#TechReview', '#SaaS'];
          highVolumeTags = ['#fyp', '#shorts', '#explorepage', '#trending'];
          viralityScore = 96;
        } else if (tone === 'educational') {
          titles = [
            { title: `Complete Breakdown: How Autonomous AI Microservices Actually Work 🧠`, ctrPredicted: 93 },
            { title: `The 2026 Engineering Guide to Multi-Platform Social Ingestion ⚙️`, ctrPredicted: 89 },
            { title: `Under the Hood: Webhook Ingest, Celery Queues & Video Transcoding 🏗️`, ctrPredicted: 87 },
          ];
          description = `A comprehensive educational deep-dive into the architectural mechanics behind modern video syndication platforms.\n\nIn this lesson, we examine:\n1. Asynchronous Celery & Redis task queues for video encoding\n2. OAuth2 Long-Lived token handshakes for Meta Graph API v19\n3. Resumable chunked upload pipelines for YouTube Data API v3\n\nBookmark this video for your tech portfolio!`;
          trendingTags = ['#Engineering', '#SoftwareArchitecture', '#LearnCoding', '#TechTutorial'];
          nicheTags = ['#SystemDesign', '#FullStackMobile', '#DevOps2026'];
          highVolumeTags = ['#technology', '#education', '#programming'];
          viralityScore = 88;
        } else {
          // Professional Tech & Casual
          titles = [
            { title: `Top 5 Autonomous AI Systems Transforming Content Workflows 💼`, ctrPredicted: 94 },
            { title: `Why Top Agencies Switched to Autonomous Omni-Channel Syndication 🚀`, ctrPredicted: 90 },
            { title: `Maximizing Social Distribution: The 4-Video Daily Pipeline Blueprint 📊`, ctrPredicted: 88 },
          ];
          description = `Discover how modern digital creators and enterprise media agencies automate multi-platform video distribution without compromising on high-retention metadata.\n\nKey Takeaways:\n• Automated Gmail drop box harvesting\n• High-volume 4+ video daily scheduled queues\n• End-to-end cryptographic and biometric security\n\nLearn more at OmniStream AI.`;
          trendingTags = ['#AIEnterprise', '#ProductivityHacks', '#CreatorEconomy', '#TechNews'];
          nicheTags = ['#ContentSyndication', '#MediaOps', '#DigitalAgency'];
          highVolumeTags = ['#tech', '#business', '#innovation'];
          viralityScore = 91;
        }

        resolve({
          titles,
          description,
          trendingTags,
          nicheTags,
          highVolumeTags,
          viralityScore,
          bestTimeToPost: '06:30 PM (Evening Peak)',
          sentimentTone: tone.replace('_', ' ').toUpperCase(),
        });
      }, 1200);
    });
  };

  return (
    <AppContext.Provider
      value={{
        videos,
        dailySlots,
        harvestedEmails,
        socialAccounts,
        teamMembers,
        transactions,
        auditLogs,
        isHarvesting,
        isUploading,
        uploadProgress,
        uploadStatusStep,
        addVideo,
        scheduleVideoToSlot,
        removeVideoFromSlot,
        togglePlatformSync,
        uploadSimultaneously,
        triggerGmailSweep,
        importHarvestedEmailToPipeline,
        updateMemberPermissions,
        inviteMember,
        processWithdrawal,
        upgradePlan,
        generateAiContent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
