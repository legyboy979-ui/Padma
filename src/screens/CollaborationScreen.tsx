import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';

interface CollaborationScreenProps {
  onOpenInviteModal: () => void;
}

export const CollaborationScreen: React.FC<CollaborationScreenProps> = ({ onOpenInviteModal }) => {
  const { teamMembers, updateMemberPermissions, auditLogs } = useApp();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [selectedMemberId, setSelectedMemberId] = useState<string>(teamMembers[1]?.id || 'tm_2');

  const selectedMember = teamMembers.find((m) => m.id === selectedMemberId) || teamMembers[0];

  const roleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' };
      case 'admin':
        return { bg: 'rgba(139, 92, 246, 0.15)', text: '#A78BFA' };
      case 'editor':
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38BDF8' };
      case 'publisher':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981' };
      case 'analyst':
        return { bg: 'rgba(234, 179, 8, 0.15)', text: '#EAB308' };
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Ionicons name="people" size={18} color="#8B5CF6" />
        </View>
        <View>
          <Text style={styles.title}>{t('teamTitle')}</Text>
          <Text style={styles.sub}>{t('teamSubtitle')}</Text>
        </View>
      </View>

      {/* Workspace Bar & Invite Button */}
      <View style={styles.workspaceBar}>
        <View style={styles.wsInfo}>
          <Ionicons name="business-outline" size={16} color="#8B5CF6" />
          <Text style={styles.wsTitle}>{t('workspaceName')}</Text>
        </View>
        <TouchableOpacity
          style={styles.inviteBtn}
          onPress={onOpenInviteModal}
          activeOpacity={0.8}
        >
          <Ionicons name="person-add" size={13} color="#FFFFFF" />
          <Text style={styles.inviteBtnText}>
            {language === 'hi' ? 'सदस्य जोड़ें' : 'Invite Member'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Team Roster List */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>
          {language === 'hi' ? 'टीम सदस्य (अनुमतियां प्रबंधित करने हेतु टैप करें)' : 'Team Members (Tap to Edit RBAC)'}
        </Text>
        {teamMembers.map((member) => {
          const badge = roleBadgeStyle(member.role);
          const isSelected = member.id === selectedMemberId;
          const isMe = member.email === user.email;

          return (
            <TouchableOpacity
              key={member.id}
              style={[styles.memberRow, isSelected && styles.memberRowSelected]}
              onPress={() => setSelectedMemberId(member.id)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: member.avatar }} style={styles.avatarImg} />
              <View style={{ flex: 1 }}>
                <View style={styles.memberNameRow}>
                  <Text style={styles.memberName}>
                    {member.name} {isMe ? '(You)' : ''}
                  </Text>
                  <View style={[styles.roleBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.roleBadgeText, { color: badge.text }]}>
                      {member.role.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.memberEmail}>{member.email}</Text>
                <Text style={styles.memberActive}>{member.lastActive}</Text>
              </View>
              <Ionicons
                name={isSelected ? 'chevron-down' : 'chevron-forward'}
                size={16}
                color={isSelected ? '#8B5CF6' : '#64748B'}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Granular RBAC Permissions Matrix for Selected Member */}
      {selectedMember && (
        <View style={styles.card}>
          <View style={styles.matrixHeaderRow}>
            <View>
              <Text style={styles.cardLabel}>{t('permissionsTitle')}</Text>
              <Text style={styles.matrixSub}>
                Managing permissions for: <Text style={{ color: '#A78BFA' }}>{selectedMember.name}</Text>
              </Text>
            </View>
            <View style={[styles.rolePill, { backgroundColor: roleBadgeStyle(selectedMember.role).bg }]}>
              <Text style={[styles.rolePillText, { color: roleBadgeStyle(selectedMember.role).text }]}>
                {selectedMember.role.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Perm 1: Upload */}
          <View style={styles.permRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.permTitle}>{t('permUpload')}</Text>
              <Text style={styles.permDesc}>
                Direct upload MP4s, manual tag entry & Gmail ingestion trigger
              </Text>
            </View>
            <Switch
              value={selectedMember.permissions.canUpload}
              disabled={selectedMember.role === 'owner'}
              onValueChange={(val) =>
                updateMemberPermissions(selectedMember.id, { canUpload: val })
              }
              trackColor={{ false: '#334155', true: '#8B5CF6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Perm 2: Public Scheduling */}
          <View style={styles.permRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.permTitle}>{t('permSchedule')}</Text>
              <Text style={styles.permDesc}>
                Directly schedule into public feed slots without admin pre-review
              </Text>
            </View>
            <Switch
              value={selectedMember.permissions.canSchedule}
              disabled={selectedMember.role === 'owner'}
              onValueChange={(val) =>
                updateMemberPermissions(selectedMember.id, { canSchedule: val })
              }
              trackColor={{ false: '#334155', true: '#8B5CF6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Perm 3: Connect Channels */}
          <View style={styles.permRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.permTitle}>{t('permChannels')}</Text>
              <Text style={styles.permDesc}>
                Authorize new YouTube, Instagram & Facebook OAuth tokens
              </Text>
            </View>
            <Switch
              value={selectedMember.permissions.canManageChannels}
              disabled={selectedMember.role === 'owner'}
              onValueChange={(val) =>
                updateMemberPermissions(selectedMember.id, { canManageChannels: val })
              }
              trackColor={{ false: '#334155', true: '#8B5CF6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Perm 4: Wallet Withdrawal */}
          <View style={styles.permRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.permTitle}>{t('permWithdraw')}</Text>
              <Text style={styles.permDesc}>
                Disburse creator funds via instant UPI or Bank IMPS settlement
              </Text>
            </View>
            <Switch
              value={selectedMember.permissions.canWithdraw}
              disabled={selectedMember.role === 'owner'}
              onValueChange={(val) =>
                updateMemberPermissions(selectedMember.id, { canWithdraw: val })
              }
              trackColor={{ false: '#334155', true: '#8B5CF6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Perm 5: AI Engine */}
          <View style={[styles.permRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.permTitle}>{t('permAi')}</Text>
              <Text style={styles.permDesc}>
                Synthesize high-CTR hooks, descriptions & hashtag clusters
              </Text>
            </View>
            <Switch
              value={selectedMember.permissions.canUseAi}
              disabled={selectedMember.role === 'owner'}
              onValueChange={(val) =>
                updateMemberPermissions(selectedMember.id, { canUseAi: val })
              }
              trackColor={{ false: '#334155', true: '#8B5CF6' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      )}

      {/* Audit Log Roster */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>{t('auditLogTitle')}</Text>
        {auditLogs.map((log, idx) => (
          <View
            key={log.id}
            style={[styles.auditRow, idx < auditLogs.length - 1 && styles.auditRowBorder]}
          >
            <Ionicons name="shield-checkmark" size={14} color="#06B6D4" style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.auditAction}>{log.action}</Text>
              <Text style={styles.auditDetail}>{log.detail}</Text>
              <Text style={styles.auditMeta}>
                {log.user} • {log.timestamp}
              </Text>
            </View>
          </View>
        ))}
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
  workspaceBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 14,
  },
  wsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wsTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  inviteBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
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
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  memberRowSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  avatarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  memberEmail: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 1,
  },
  memberActive: {
    color: '#10B981',
    fontSize: 10,
    marginTop: 2,
  },
  matrixHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  matrixSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  rolePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  permTitle: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },
  permDesc: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
    maxWidth: 240,
  },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 8,
  },
  auditRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
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
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
  },
});
