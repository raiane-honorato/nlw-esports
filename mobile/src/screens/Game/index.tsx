import { useEffect, useState } from 'react';
import {  View, TouchableOpacity, Image, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';

import logoImg from '../../assets/logo-nlw-esports.png';

import { THEME } from '../../theme';
import { styles } from './styles';

import { GameParams } from '../../@types/navigation';

import { Header } from '../../components/Header';
import { Background } from '../../components/Background';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { DuoMatch } from '../../components/DuoMatch';

export function Game() {
  const [duos, setDuos] = useState<DuoCardProps[]>([]);
  const [discordDuoSelected, setDiscordDuoSelected] = useState<string>('');

  const navigation = useNavigation();
  const route = useRoute();
  const game = route.params as GameParams;

  function handleGoBack() {
    navigation.goBack();
  };

  useEffect(() => {
    fetch(`http://192.168.100.16:3333/games/${game.id}/ads`)
    .then(res => res.json())
    .then(data => setDuos(data))
  }, []);

  function getDiscordUser(adsId: string) {
    fetch(`http://192.168.100.16:3333/ads/${adsId}/discord`)
    .then(res => res.json())
    .then(data => setDiscordDuoSelected(data.discord))
  }

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>
          <Image
            style={styles.logo}
            source={logoImg}
          />
          <View style={styles.right}/>
        </View>

        <Image 
          source={{ uri: game.bannerUrl }}
          style={styles.cover}
          resizeMode="cover"
        />

        <Header
          title={game.title}
          subtitle={'Conecte-se e comece a jogar!'}
        />
        <FlatList
          data={duos}
          keyExtractor={item => `duo-card-${item.id}`}
          contentContainerStyle={duos.length > 0 ? styles.contentList : styles.emptyListContent}
          style={styles.containerList}
          renderItem={({ item }) => (
            <DuoCard
              data={item}
              onConnect={() => {getDiscordUser(item.id)}}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Não há anúncios publicados ainda.
            </Text>
          )}
        />

        <DuoMatch
          visible={discordDuoSelected.length > 0}
          discord={discordDuoSelected}
          onClose={() => setDiscordDuoSelected('')}
        />
      </SafeAreaView>
    </Background>
  );
};