import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Image, Platform, Animated, useWindowDimensions } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface Avatar3DProps {
  size: number;
  avatarSource: any;
}

export default function Avatar3D({ size, avatarSource }: Avatar3DProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Mobile Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Loop pulse animation on mobile
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.15,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1.0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacityAnim, {
              toValue: 0.2,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.7,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    }
  }, [pulseAnim, opacityAnim]);

  // Web mouse move logic
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: any) => {
    if (Platform.OS !== 'web' || !containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Calculate cursor position relative to center of element (-0.5 to 0.5 range)
    const x = (e.nativeEvent.clientX - rect.left) / rect.width - 0.5;
    const y = (e.nativeEvent.clientY - rect.top) / rect.height - 0.5;

    // Apply values to CSS custom properties
    container.style.setProperty('--mouse-x', x.toFixed(3));
    container.style.setProperty('--mouse-y', y.toFixed(3));
  };

  const handleMouseLeave = () => {
    if (Platform.OS !== 'web' || !containerRef.current) return;
    const container = containerRef.current;
    
    // Smooth reset values
    container.style.setProperty('--mouse-x', '0');
    container.style.setProperty('--mouse-y', '0');
  };

  if (Platform.OS === 'web') {
    // Generate inline style tag for CSS rules
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <style>{`
          .avatar-container-3d {
            position: relative;
            transform-style: preserve-3d;
            perspective: 1200px;
            transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
            transform: rotateY(calc(var(--mouse-x, 0) * 35deg)) rotateX(calc(var(--mouse-y, 0) * -35deg));
          }
          
          .avatar-container-3d:hover {
            box-shadow: 0 35px 75px ${themeColors.tint}40;
            transform: scale(1.06) rotateY(calc(var(--mouse-x, 0) * 45deg)) rotateX(calc(var(--mouse-y, 0) * -45deg));
          }
          
          .avatar-border-3d {
            transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.4s ease;
            transform-style: preserve-3d;
            border-color: ${themeColors.tint}88;
          }
          
          .avatar-container-3d:hover .avatar-border-3d {
            transform: translateZ(20px);
            border-color: ${themeColors.tint};
          }
          
          .avatar-img-3d {
            transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          }
          
          .avatar-container-3d:hover .avatar-img-3d {
            transform: translateZ(40px) scale(1.06);
          }

          /* Dual Rotating Rings */
          .avatar-ring {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            transform-style: preserve-3d;
            transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
          }
          
          .avatar-ring-1 {
            top: -6%;
            left: -6%;
            width: 112%;
            height: 112%;
            border: 2px dashed ${themeColors.tint}66;
            transform: translateZ(-20px);
            animation: spin-clockwise 25s linear infinite;
          }
          
          .avatar-ring-2 {
            top: -12%;
            left: -12%;
            width: 124%;
            height: 124%;
            border: 1.5px solid ${themeColors.tint}33;
            transform: translateZ(-40px);
            animation: spin-counter 18s linear infinite;
          }
          
          .avatar-container-3d:hover .avatar-ring-1 {
            transform: translateZ(-30px) scale(1.03);
            border-color: ${themeColors.tint};
            filter: drop-shadow(0 0 10px ${themeColors.tint});
            opacity: 0.85;
          }
          
          .avatar-container-3d:hover .avatar-ring-2 {
            transform: translateZ(-60px) scale(1.05);
            border-color: ${themeColors.tint}99;
            filter: drop-shadow(0 0 12px ${themeColors.tint}66);
            opacity: 0.65;
          }

          /* 3D Floating Tech Badges */
          .badge-3d {
            position: absolute;
            width: ${size * 0.12}px;
            height: ${size * 0.12}px;
            border-radius: 50%;
            background: ${themeColors.card};
            border: 1.5px solid ${themeColors.border};
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15), 0 0 8px ${themeColors.tint}22;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
            z-index: 15;
            pointer-events: none;
          }
          
          .avatar-container-3d:hover .badge-3d {
            border-color: ${themeColors.tint};
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25), 0 0 15px ${themeColors.tint}88;
          }
          
          .badge-1 { /* Top Left: Linux Terminal */
            top: 2%;
            left: -3%;
            transform: translateZ(50px);
            animation: float-badge-1 5s ease-in-out infinite alternate;
          }
          .badge-2 { /* Top Right: Network */
            top: 15%;
            right: -6%;
            transform: translateZ(75px);
            animation: float-badge-2 4.2s ease-in-out infinite alternate;
          }
          .badge-3 { /* Bottom Left: Server/SQL */
            bottom: 18%;
            left: -8%;
            transform: translateZ(60px);
            animation: float-badge-3 4.8s ease-in-out infinite alternate;
          }
          .badge-4 { /* Bottom Right: Web/React */
            bottom: 4%;
            right: -2%;
            transform: translateZ(85px);
            animation: float-badge-4 4.5s ease-in-out infinite alternate;
          }

          /* Badge Float keyframes */
          @keyframes float-badge-1 {
            0% { transform: translateZ(40px) translateY(-5px) rotate(-6deg); }
            100% { transform: translateZ(60px) translateY(5px) rotate(6deg); }
          }
          @keyframes float-badge-2 {
            0% { transform: translateZ(60px) translateY(4px) rotate(8deg); }
            100% { transform: translateZ(85px) translateY(-6px) rotate(-8deg); }
          }
          @keyframes float-badge-3 {
            0% { transform: translateZ(50px) translateY(6px) rotate(-10deg); }
            100% { transform: translateZ(70px) translateY(-4px) rotate(10deg); }
          }
          @keyframes float-badge-4 {
            0% { transform: translateZ(70px) translateY(-7px) rotate(5deg); }
            100% { transform: translateZ(95px) translateY(5px) rotate(-5deg); }
          }

          /* Ring spins */
          @keyframes spin-clockwise {
            0% { transform: translateZ(-20px) rotate(0deg); }
            100% { transform: translateZ(-20px) rotate(360deg); }
          }
          @keyframes spin-counter {
            0% { transform: translateZ(-40px) rotate(360deg); }
            100% { transform: translateZ(-40px) rotate(0deg); }
          }

          /* Hologram Sweep */
          .hologram-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              rgba(18, 16, 16, 0) 50%,
              ${themeColors.tint}12 50%
            );
            background-size: 100% 4px;
            z-index: 5;
            pointer-events: none;
            opacity: 0.3;
            transition: opacity 0.3s ease;
          }
          
          .avatar-container-3d:hover .hologram-overlay {
            opacity: 0.7;
            animation: scanline-sweep 6s linear infinite;
          }
          
          @keyframes scanline-sweep {
            0% { background-position: 0 0; }
            100% { background-position: 0 100%; }
          }
        `}</style>

        <div
          ref={containerRef as any}
          className="avatar-container-3d"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            width: size,
            height: size,
            filter: `drop-shadow(0 0 25px ${themeColors.tint}50)`,
            backgroundColor: 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          {/* Rotating Rings */}
          <div className="avatar-ring avatar-ring-1" />
          <div className="avatar-ring avatar-ring-2" />

          {/* Floating Badges */}
          <div className="badge-3d badge-1">
            <Ionicons name="terminal-outline" size={size * 0.065} color={themeColors.tint} />
          </div>
          <div className="badge-3d badge-2">
            <Ionicons name="git-network-outline" size={size * 0.065} color={themeColors.tint} />
          </div>
          <div className="badge-3d badge-3">
            <Ionicons name="server-outline" size={size * 0.065} color={themeColors.tint} />
          </div>
          <div className="badge-3d badge-4">
            <Ionicons name="logo-react" size={size * 0.065} color={themeColors.tint} />
          </div>

          {/* Main Avatar Border */}
          <View
            className="avatar-border-3d"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: themeColors.tint,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              justifyContent: 'center',
              alignItems: 'center',
            } as any}
          >
            {/* Main Avatar Inner Container */}
            <View
              style={{
                width: '97.5%',
                height: '97.5%',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                backgroundColor: themeColors.background,
                overflow: 'hidden',
                position: 'relative',
              } as any}
            >
              <Image
                source={avatarSource}
                className="avatar-img-3d"
                style={styles.profilePic}
                resizeMode="cover"
              />
              <div className="hologram-overlay" />
            </View>
          </View>
        </div>
      </View>
    );
  }

  // Mobile Version: Nice double pulsing rings
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer pulse ring */}
      <Animated.View
        style={[
          styles.mobilePulseRing,
          {
            width: size * 1.08,
            height: size * 1.08,
            borderColor: themeColors.tint,
            opacity: opacityAnim,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      {/* Static image wrapper */}
      <View
        style={[
          styles.imageWrapper,
          {
            shadowColor: themeColors.tint,
            borderColor: themeColors.tint,
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <Image source={avatarSource} style={styles.profilePic} resizeMode="cover" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profilePic: {
    width: '100%',
    height: '100%',
  },
  imageWrapper: {
    borderWidth: 3,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 8,
    backgroundColor: 'rgba(0, 238, 255, 0.1)',
  },
  mobilePulseRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderRadius: 999,
  },
});
