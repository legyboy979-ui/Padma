export type Language = 'en' | 'hi';

export type UserRole = 'owner' | 'admin' | 'editor' | 'publisher' | 'analyst';

export interface UserPermissions {
  canUpload: boolean;
  canSchedule: boolean;
  canManageChannels: boolean;
  canWithdraw: boolean;
  canUseAi: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  isRegistered: boolean;
  mfaEnabled: boolean;
  biometricEnabled: boolean;
  passcode: string;
  isPasscodeSet: boolean;
  subscriptionPlan: 'trial' | 'monthly_500' | 'quarterly_1350' | 'free';
  trialDaysRemaining: number;
  subscriptionExpiresAt: string;
  walletBalanceINR: number;
  totalEarningsINR: number;
  pendingClearanceINR: number;
}

export type PlatformKey = 'youtube' | 'facebook' | 'instagram';

export interface PlatformConfig {
  youtube: boolean;
  facebook: boolean;
  instagram: boolean;
}

export type VideoStatus = 'draft' | 'scheduled' | 'harvested' | 'synthesized' | 'published' | 'processing';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  hashtags: string[];
  thumbnailUrl: string;
  videoDuration: string;
  platforms: PlatformConfig;
  status: VideoStatus;
  scheduledSlotTime: string;
  scheduledDate: string;
  slotIndex: number; // 0, 1, 2, 3 (4 daily slots)
  source: 'manual' | 'gmail_harvest' | 'ai_synthesizer';
  senderEmail?: string;
  views?: number;
  engagementScore?: number;
  publishedAt?: string;
  viralityForecast?: number;
}

export interface HarvestedEmail {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  receivedAt: string;
  attachmentName: string;
  attachmentSize: string;
  status: 'pending_review' | 'auto_scheduled' | 'imported';
  videoThumbnail: string;
  extractedTitle: string;
  suggestedTags: string[];
  downloadUrl: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'active' | 'invited' | 'offline';
  permissions: UserPermissions;
  lastActive: string;
  assignedChannels: PlatformKey[];
}

export interface WalletTransaction {
  id: string;
  title: string;
  platformSource?: PlatformKey;
  type: 'earning' | 'withdrawal';
  amountINR: number;
  status: 'completed' | 'processing' | 'failed';
  timestamp: string;
  destination?: string;
  referenceId: string;
  method?: 'UPI' | 'IMPS' | 'AdSense' | 'MetaCreator';
}

export interface DailySlot {
  slotIndex: number;
  timeStr: string;
  labelEn: string;
  labelHi: string;
  peakReachScore: number; // e.g. 96
  assignedVideo?: VideoItem;
}

export interface SocialChannelAccount {
  platform: PlatformKey;
  name: string;
  handle: string;
  avatarUrl: string;
  subscribers: string;
  status: 'connected' | 'reauth_needed';
  lastSynced: string;
  apiProtocol: string;
  tokenExpiresIn: string;
}

export type AiTone = 'viral_hype' | 'professional_tech' | 'educational' | 'casual' | 'desi_hindi';

export interface AiGeneratedContent {
  titles: { title: string; ctrPredicted: number }[];
  description: string;
  trendingTags: string[];
  nicheTags: string[];
  highVolumeTags: string[];
  viralityScore: number;
  bestTimeToPost: string;
  sentimentTone: string;
}
