import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { RemindrLogo } from '@/components/ui/RemindrLogo';
import { Theme } from '@/theme';
import { useAuth } from '@/context/AuthContext';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { loginWithGoogle, loginWithTelegram } = useAuth();
  
  // ... (keeping existing hooks) ...
  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        loginWithGoogle(id_token);
      }
    } else if (response?.type === 'error') {
      console.error('Google Auth Error:', response.error);
    }
  }, [response]);

  const handleGoogleLogin = () => {
    promptAsync();
  };

  const handleTelegramLogin = async () => {
    // Open Telegram Bot for Auth
    // The bot should redirect back to remindr://auth/telegram?token=...
    const botUrl = process.env.EXPO_PUBLIC_TELEGRAM_BOT_URL || 'https://t.me/remindr_bot?start=auth';
    await Linking.openURL(botUrl);
  };

  // Handle Telegram Deep Link Return
  useEffect(() => {
    const handleDeepLink = (event: Linking.EventType) => {
      const { url } = event;
      const parsed = Linking.parse(url);
      
      // Check if it's the telegram auth callback
      if (parsed.path === 'auth/telegram' && parsed.queryParams?.token) {
        const token = parsed.queryParams.token;
        if (typeof token === 'string') {
          loginWithTelegram({ token });
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Check initial URL
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url, nativeEvent: null } as any);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Glow */}
      <View style={styles.glowContainer}>
         <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient
              id="grad"
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0" stopColor="#9333ea" stopOpacity="0.2" />
              <Stop offset="1" stopColor="#9333ea" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="50%" cy="50%" r="50%" fill="url(#grad)" />
        </Svg>
      </View>

      {/* Background Glow Bottom Right */}
      <View style={styles.glowContainerBottomRight}>
         <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient
              id="grad-br"
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0" stopColor="#9333ea" stopOpacity="0.2" />
              <Stop offset="1" stopColor="#9333ea" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="50%" cy="50%" r="50%" fill="url(#grad-br)" />
        </Svg>
      </View>

      <SafeAreaView style={styles.contentContainer}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.header}>
          <RemindrLogo size={160} style={{ marginBottom: 24 }} />
          <Text style={styles.appName}>Remind
            <Text style={styles.appName2}>r</Text>
          </Text>
          <Text style={styles.tagline}>Manage what matters.</Text>
          <Text style={styles.description}>
            Smart reminders for deadlines, contracts, and{'\n'}important life events.
          </Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.googleButton]} 
            onPress={handleGoogleLogin}
            disabled={!request}
            activeOpacity={0.8}
          >
            <AntDesign name="google" size={24} color="black" style={styles.icon} />
            <Text style={[styles.buttonText, styles.googleButtonText]}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.telegramButton]} 
            onPress={handleTelegramLogin}
            activeOpacity={0.8}
          >
            <FontAwesome name="telegram" size={24} color="white" style={styles.icon} />
            <Text style={[styles.buttonText, styles.telegramButtonText]}>Continue with Telegram</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>BY SIGNING IN, YOU AGREE TO OUR</Text>
          <Text style={styles.footerLink2}>TERMS OF SERVICE 
            <Text style={styles.footerLink}>&</Text>
            <Text style={styles.footerLink2}>PRIVACY POLICY</Text>
          </Text>
        </View>
      </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#050505',
    overflow: 'hidden',
  },
  glowContainer: {
    pointerEvents: 'none',
    position: 'absolute',
    top: '-20%',
    left: '-40%',
    width: 500, // w-72
    height: 500,
  },
  glowContainerBottomRight: {
    pointerEvents: 'none',
    position: 'absolute',
    bottom: '-10%',
    right: '-10%',
    width: 288, // w-72
    height: 288,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  appName: {
    fontSize: 48,
    fontWeight: 900,
    fontFamily: Theme.typography.family.bold,
    color: '#fff',
    letterSpacing: -2.2,
    marginBottom: 12,
    marginTop: 24,
  },
  appName2: {
    color: 'rgb(225, 42, 251)'
  },
  tagline: {
    fontSize: 18,
    color: '#9f9fa9',
    marginBottom: 8,
    fontWeight: '500',
    fontFamily: Theme.typography.family.medium,
  },
  description: {
    fontSize: 12,
    color: '#9f9fa9',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: Theme.typography.family.regular,
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    borderRadius: 24,
    width: '100%',
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Theme.typography.family.medium,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  googleButtonText: {
    color: '#000000',
  },
  telegramButton: {
    backgroundColor: '#2AABEE', // Telegram Blue
  },
  telegramButtonText: {
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    marginTop: 48,
  },
  footerText: {
    color: '#444',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
    fontFamily: Theme.typography.family.bold,
  },
  footerLink: {
    color: '#52525c',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: Theme.typography.family.extraBold,
  },
  footerLink2: {
    color: '#9f9fa9',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    fontFamily: Theme.typography.family.extraBold,
  },
});
