import { Audio } from 'expo-av';
import { useCallback, useEffect, useState } from 'react';
import { reaction } from 'mobx';
import click from '../assets/audios/click.wav';
import savedSound from '../assets/audios/saved.wav';
import errorSound from '../assets/audios/error.mp3';
import win from '../assets/audios/win.wav';
import lose from '../assets/audios/lose.wav';
import secondsTimerSound from '../assets/audios/secondstimer.mp3';
import powershot from '../assets/audios/powershot.mp3';
import gamestarts from '../assets/audios/gamestarts.wav';
import { SettingsStore } from '../stores/SettingsStore';

const useSounds = () => {
  const [soundEffect, setSoundEffect] = useState<Audio.Sound>();
  const [isSoundsEnabled, setIsSoundsEnabled] = useState<boolean>(
    SettingsStore.currentSoundsEnabled?.value ?? true
  );

  useEffect(() => {
    if (isSoundsEnabled) {
      return soundEffect
        ? () => {
            soundEffect.unloadAsync();
          }
        : undefined;
    }
    return undefined;
  }, [isSoundsEnabled, soundEffect]);

  useEffect(() => {
    SettingsStore.getAppSounds();
    reaction(
      () => SettingsStore.currentSoundsEnabled?.value,
      (newValue) => {
        setIsSoundsEnabled(newValue ?? true);
      }
    );
  }, []);

  const emitPlayClickSound = useCallback(async () => {
    if (isSoundsEnabled) {
      const { sound } = await Audio.Sound.createAsync(click);
      setSoundEffect(sound);
      await sound.playAsync();
    }
  }, [isSoundsEnabled]);

  const emitPlaySavedSound = useCallback(async () => {
    if (isSoundsEnabled) {
      const { sound } = await Audio.Sound.createAsync(savedSound);
      setSoundEffect(sound);
      await sound.playAsync();
    }
  }, [isSoundsEnabled]);

  const emitPlayErrorSound = useCallback(async () => {
    if (isSoundsEnabled) {
      const { sound } = await Audio.Sound.createAsync(errorSound);
      setSoundEffect(sound);
      await sound.playAsync();
    }
  }, [isSoundsEnabled]);

  const emitPlayTimerSound = useCallback(async () => {
    if (isSoundsEnabled) {
      const { sound } = await Audio.Sound.createAsync(secondsTimerSound);
      setSoundEffect(sound);
      await sound.playAsync();
    }
  }, [isSoundsEnabled]);

  const emitPlayPowershotSound = useCallback(async () => {
    if (isSoundsEnabled) {
      const { sound } = await Audio.Sound.createAsync(powershot);
      setSoundEffect(sound);
      await sound.playAsync();
    }
  }, [isSoundsEnabled]);

  const emitPlayGameStartsSound = useCallback(async () => {
    if (isSoundsEnabled) {
      const { sound } = await Audio.Sound.createAsync(gamestarts);
      setSoundEffect(sound);
      await sound.playAsync();
    }
  }, [isSoundsEnabled]);

  const emitPlayWinSound = useCallback(async () => {
    if (isSoundsEnabled) {
      const { sound } = await Audio.Sound.createAsync(win);
      setSoundEffect(sound);
      await sound.playAsync();
    }
  }, [isSoundsEnabled]);

  const emitPlayLoseSound = useCallback(async () => {
    if (isSoundsEnabled) {
      const { sound } = await Audio.Sound.createAsync(lose);
      setSoundEffect(sound);
      await sound.playAsync();
    }
  }, [isSoundsEnabled]);

  return {
    emitPlayErrorSound,
    emitPlayGameStartsSound,
    emitPlayPowershotSound,
    emitPlaySavedSound,
    emitPlayTimerSound,
    emitPlayWinSound,
    emitPlayLoseSound,
    emitPlayClickSound,
  };
};

export default useSounds;
