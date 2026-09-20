import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';

interface InviteMemberModalProps {
  visible: boolean;
  onClose: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ visible, onClose }) => {
  const { inviteMember } = useApp();
  const { language } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('editor');
  const [generatedInviteLink, setGeneratedInviteLink] = useState('');

  if (!visible) return null;

  const rolesList: { id: UserRole; titleEn: string; titleHi: string; descEn: string; descHi: string }[] = [
    {
      id: 'admin',
      titleEn: 'Production Admin',
      titleHi: 'प्रोडक्शन एडमिन',
      descEn: 'Full access to scheduling, AI & channel management',
      descHi: 'शेड्यूलिंग, AI और चैनल प्रबंधन का पूर्ण अधिकार',
    },
    {
      id: 'editor',
      titleEn: 'Video Editor',
      titleHi: 'वीडियो एडिटर',
      descEn: 'Can upload & tag videos. Scheduling requires approval',
      descHi: 'वीडियो अपलोड और टैग कर सकते हैं। शेड्यूलिंग हेतु अनुमति आवश्यक',
    },
    {
      id: 'publisher',
      titleEn: 'Content Scheduler',
      titleHi: 'कंटेंट शेड्यूलर',
      descEn: 'Can assign to daily 4-slots and trigger immediate release',
      descHi: 'दैनिक 4-स्लॉट में असाइन और तत्काल रिलीज़ करने का अधिकार',
    },
    {
      id: 'analyst',
      titleEn: 'Financial Analyst',
      titleHi: 'वित्तीय विश्लेषक',
      descEn: 'Read-only analytics + wallet withdrawal authority',
      descHi: 'एनालिटिक्स देखने और वॉलेट निकासी का अधिकार',
    },
  ];

  const handleSendInvite = () => {
    if (!name || !email) return;
    inviteMember(name, email, role);
    const link = `https://omnistream.ai/join?token=INV_${Math.floor(100000 + Math.random() * 900000)}&team=studio-alpha`;
    setGeneratedInviteLink(link);
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setGeneratedInviteLink('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="person-add-outline" size={18} color="#8B5CF6" />
              </View>
              <View>
                <Text style={styles.title}>
                  {language === 'hi' ? 'टीम सदस्य आमंत्रित करें' : 'Invite Team Member'}
                </Text>
                <Text style={styles.sub}>
                  {language === 'hi'
                    ? 'ग्रैनुलर रोल और एक्सेस अधिकार असाइन करें'
                    : 'Assign Granular Roles & Access Management'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {generatedInviteLink ? (
              <View style={styles.successBox}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={32} color="#10B981" />
                </View>
                <Text style={styles.successTitle}>
                  {language === 'hi' ? 'निमंत्रण टोकन तैयार है!' : 'Invite Token Generated!'}
                </Text>
                <Text style={styles.successSub}>
                  {language === 'hi'
                    ? `${name} (${email}) को ${role} रोल के साथ आमंत्रित किया गया है।`
                    : `Invitation dispatched to ${name} (${email}) as ${role.toUpperCase()}.`}
                </Text>
                <View style={styles.linkBox}>
                  <Text style={styles.linkLabel}>Secure Single-Use Invite Link:</Text>
                  <Text style={styles.linkText} numberOfLines={2}>
                    {generatedInviteLink}
                  </Text>
                </View>
                <TouchableOpacity style={styles.doneBtn} onPress={handleClose}>
                  <Text style={styles.doneBtnText}>{language === 'hi' ? 'पूर्ण' : 'Done'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.inputLabel}>
                  {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Vikram Joshi"
                  placeholderTextColor="#64748B"
                  value={name}
                  onChangeText={setName}
                />

                <Text style={styles.inputLabel}>
                  {language === 'hi' ? 'ईमेल पता' : 'Work Email Address'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="editor@omnistream.agency"
                  placeholderTextColor="#64748B"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <Text style={styles.inputLabel}>
                  {language === 'hi' ? 'रोल और एक्सेस स्तर चुनें' : 'Select Access Role'}
                </Text>
                {rolesList.map((r) => (
                  <TouchableOpacity
                    key={r.id}
                    style={[styles.roleCard, role === r.id && styles.roleCardActive]}
                    onPress={() => setRole(r.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.roleCardTop}>
                      <Text style={[styles.roleTitle, role === r.id && styles.roleTitleActive]}>
                        {language === 'hi' ? r.titleHi : r.titleEn}
                      </Text>
                      <Ionicons
                        name={role === r.id ? 'radio-button-on' : 'radio-button-off'}
                        size={18}
                        color={role === r.id ? '#8B5CF6' : '#64748B'}
                      />
                    </View>
                    <Text style={styles.roleDesc}>{language === 'hi' ? r.descHi : r.descEn}</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[styles.inviteBtn, (!name || !email) && styles.btnDisabled]}
                  onPress={handleSendInvite}
                  disabled={!name || !email}
                  activeOpacity={0.8}
                >
                  <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
                  <Text style={styles.inviteBtnText}>
                    {language === 'hi' ? 'निमंत्रण भेजें' : 'Generate & Send Invite'}
                  </Text>
                </TouchableOpacity>
              </>
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
    marginBottom: 6,
    marginTop: 6,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#F8FAFC',
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  roleCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  roleCardActive: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  roleCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  roleTitleActive: {
    color: '#A78BFA',
  },
  roleDesc: {
    color: '#94A3B8',
    fontSize: 12,
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 14,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  inviteBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  checkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  successSub: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  linkBox: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
    marginBottom: 20,
  },
  linkLabel: {
    color: '#64748B',
    fontSize: 11,
    marginBottom: 4,
  },
  linkText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  doneBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  doneBtnText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
});
